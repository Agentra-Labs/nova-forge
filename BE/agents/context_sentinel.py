"""Context Sentinel — ambiguity detection agent (Issue #2)."""

from __future__ import annotations

import json
from typing import Any

from backend import call_agent_text, spawn_agent
from prompts import CONTEXT_SENTINEL_PROMPT, DEFAULT_MODEL


async def run_context_sentinel(
    prompt: str,
) -> dict[str, Any]:
    """Analyze user prompt for ambiguity and missing context.
    
    Args:
        prompt: User's research request.
        
    Returns:
        Dict with confidence_score, intent, missing_context, clarification_questions, etc.
    """
    agent = await spawn_agent(
        premise=CONTEXT_SENTINEL_PROMPT,
        model=DEFAULT_MODEL,
    )
    response = await call_agent_text(agent, prompt, phase="context sentinel")
    
    # Parse JSON response
    try:
        # Extract JSON from response (may have markdown code blocks)
        text = response.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
        return json.loads(text)
    except (json.JSONDecodeError, IndexError):
        # Return default structure if parsing fails
        return {
            "confidence_score": 0.5,
            "intent": prompt[:100],
            "scope": "moderate",
            "constraints": [],
            "entities": [],
            "missing_context": ["Unable to parse context analysis"],
            "clarification_questions": [
                {"id": "q1", "question": "Could you provide more details about your research goal?"}
            ],
            "best_guess_plan": None,
            "discovery_queries": [],
        }


def format_clarification_response(analysis: dict[str, Any]) -> str:
    """Format the analysis as a user-friendly message.
    
    Args:
        analysis: The parsed context sentinel response.
        
    Returns:
        Formatted message string.
    """
    score = analysis.get("confidence_score", 0.5)
    intent = analysis.get("intent", "Unknown intent")
    missing = analysis.get("missing_context", [])
    questions = analysis.get("clarification_questions", [])
    best_guess = analysis.get("best_guess_plan")
    
    lines = [
        f"**Confidence Score:** {score:.2f}",
        f"**Detected Intent:** {intent}",
    ]
    
    if missing:
        lines.append(f"**Missing Context:** {', '.join(missing)}")
    
    if score < 0.6 and questions:
        lines.append("\n**Please clarify:**")
        for q in questions:
            lines.append(f"- {q['question']}")
            if q.get("options"):
                lines.append(f"  Options: {', '.join(q['options'])}")
    elif best_guess:
        lines.append(f"\n**Best Guess Plan:** {best_guess}")
    
    return "\n".join(lines)
