"""Evidence Auditor — claim verification agent (Issue #3)."""

from __future__ import annotations

import json
from typing import Any, AsyncIterator

from backend import call_agent_text, spawn_agent, stream_agent_sse
from prompts import EVIDENCE_AUDITOR_PROMPT, DEFAULT_MODEL
from tools.openalex import openalex_get_paper, openalex_search_papers
from tools.kernel_tools import kernel_scrape_url

# Tools for source verification
_TOOLS = {
    "openalex_search_papers": openalex_search_papers,
    "openalex_get_paper": openalex_get_paper,
    "kernel_scrape_url": kernel_scrape_url,
}


async def run_evidence_auditor(
    claims_text: str,
    sources: list[dict[str, str]],
    *,
    stream: bool = False,
) -> dict[str, Any] | AsyncIterator[str]:
    """Verify claims against source documents.
    
    Args:
        claims_text: Text containing claims to verify.
        sources: List of source documents with url, title, and optional excerpt.
        stream: If True, return SSE stream; otherwise return parsed result.
        
    Returns:
        Dict with claims, sources mapping, and audit_summary.
    """
    # Build prompt with sources
    sources_formatted = "\n\n".join([
        f"**Source {i+1}: {s.get('title', 'Unknown')}**\nURL: {s.get('url', 'N/A')}\n{s.get('excerpt', 'No excerpt provided')}"
        for i, s in enumerate(sources)
    ])
    
    prompt = f"""Verify the claims in the following text against the provided sources.

**CLAIMS TEXT:**
{claims_text}

**SOURCES:**
{sources_formatted}

Use tools to fetch additional source content if needed. Output the verification as JSON."""

    agent = await spawn_agent(
        premise=EVIDENCE_AUDITOR_PROMPT,
        model=DEFAULT_MODEL,
        scope=_TOOLS,
    )
    
    if stream:
        return stream_agent_sse(agent, prompt, phase="evidence auditor")
    
    response = await call_agent_text(agent, prompt, phase="evidence auditor")
    
    # Parse JSON response
    try:
        text = response.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
        return json.loads(text)
    except (json.JSONDecodeError, IndexError):
        # Return default structure if parsing fails
        return {
            "claims": [],
            "audit_summary": {
                "total_claims": 0,
                "verified_high": 0,
                "verified_medium": 0,
                "verified_low": 0,
                "unsupported": 1,
                "error": "Failed to parse audit response"
            }
        }
