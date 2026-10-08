/**
 * Agora Conversational AI Agent Server & MCP Dispatcher
 * Official reference: https://github.com/AgoraIO-Conversational-AI/recipe-agent-mcp
 * Agora API: https://api.agora.io/api/conversational-ai-agent/v2/projects/{appid}/join
 */

import http from 'http';
import { executeMCPTool, MCP_TOOLS } from './src/services/mcpTools.js';

const PORT = process.env.PORT || 8000;
const AGORA_APP_ID = process.env.AGORA_APP_ID || '';
const AGORA_CUSTOMER_KEY = process.env.AGORA_CUSTOMER_KEY || '';
const AGORA_CUSTOMER_SECRET = process.env.AGORA_CUSTOMER_SECRET || '';

// Basic HTTP server for Agora Conversational AI Agent lifecycle & MCP RPC
const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. Health check
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'Agora Conversational AI + MCP' }));
    return;
  }

  // 2. Start Agora Conversational AI Agent
  if (req.url === '/api/agora/start-agent' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const channel = payload.channel || 'aura-voice-copilot';
        const appId = payload.appId || AGORA_APP_ID;

        if (!appId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Agora App ID is required' }));
          return;
        }

        // Prepare request to Agora Cloud Conversational AI Agent API
        const agentUrl = `https://api.agora.io/api/conversational-ai-agent/v2/projects/${appId}/join`;
        const auth = Buffer.from(`${AGORA_CUSTOMER_KEY}:${AGORA_CUSTOMER_SECRET}`).toString('base64');

        const agoraAgentPayload = {
          channel,
          agent_rtc_uid: '9999',
          remote_rtc_uids: ['*'],
          enable_string_uid: false,
          idle_timeout: 300,
          llm: {
            url: payload.mcpEndpoint || 'http://localhost:8000/mcp',
            system_prompt: 'You are FORGE, an executive autonomous voice co-pilot built by Tanmay (Adesh Srivastava). When asked who you are or who created you, always state that you were created by Tanmay (Adesh Srivastava). You have tool calling capabilities for cab booking, train transit tracking, calendar syncing, and local price lookups.'
          }
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Agora Conversational AI agent joining channel: ${channel}`,
          agentUid: 9999,
          config: agoraAgentPayload
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 3. MCP JSON-RPC 2.0 Endpoint (for Agora Cloud or Local Agent Tool Calls)
  if (req.url === '/mcp' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const rpc = JSON.parse(body || '{}');

        // Handle tools/list
        if (rpc.method === 'tools/list') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            jsonrpc: '2.0',
            id: rpc.id,
            result: { tools: MCP_TOOLS }
          }));
          return;
        }

        // Handle tools/call
        if (rpc.method === 'tools/call') {
          const { name, arguments: args } = rpc.params || {};
          const result = await executeMCPTool(name, args || {});

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            jsonrpc: '2.0',
            id: rpc.id,
            result: {
              content: [{ type: 'text', text: JSON.stringify(result) }]
            }
          }));
          return;
        }

        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ jsonrpc: '2.0', id: rpc.id, error: { message: 'Method not supported' } }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`[Agora MCP Agent Server] running on http://localhost:${PORT}`);
  console.log(`[MCP Endpoint] http://localhost:${PORT}/mcp`);
});
