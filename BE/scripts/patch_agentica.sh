#!/bin/bash
# Patch agentica to disable MCP which causes import hangs
sed -i 's/from agentica.unmcp.mcp_function import MCPFunction/MCPFunction = None  # MCP disabled/' \
    .venv/lib/python3.13/site-packages/agentica/agent.py
