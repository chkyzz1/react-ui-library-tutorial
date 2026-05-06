const readline = require('readline');
const { createReport: createComponentReport } = require('./analyzeComponents');
const { createReport: createTokenReport, fixAll } = require('./scanTokens');
const { createReport: createGovernanceReport } = require('./scanGovernance');

const serverInfo = {
  name: '@nimbus-ui/mcp-server',
  version: '1.2.0',
};

const tools = [
  {
    name: 'scan_components',
    description: 'Analyze Nimbus UI component props, events, docs, stories, tests, and quality score.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: 'scan_tokens',
    description: 'Scan Nimbus UI component styles for hardcoded colors and design token mappings.',
    inputSchema: {
      type: 'object',
      properties: {
        fix: {
          type: 'boolean',
          description: 'Apply safe token replacements for mapped hardcoded colors.',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'scan_governance',
    description: 'Generate the combined component and token governance report.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
];

function handleRequest(message) {
  const { id, method, params } = message;

  try {
    if (method === 'initialize') {
      return result(id, {
        protocolVersion: params?.protocolVersion || '2024-11-05',
        capabilities: {
          tools: {},
        },
        serverInfo,
      });
    }

    if (method === 'notifications/initialized') {
      return null;
    }

    if (method === 'tools/list') {
      return result(id, { tools });
    }

    if (method === 'tools/call') {
      return result(id, callTool(params?.name, params?.arguments || {}));
    }

    return error(id, -32601, `Unsupported method: ${method}`);
  } catch (err) {
    return error(id, -32000, err instanceof Error ? err.message : String(err));
  }
}

function callTool(name, args) {
  if (name === 'scan_components') return toolResult(createComponentReport());
  if (name === 'scan_tokens') {
    const fix = args.fix ? fixAll() : null;
    return toolResult(fix ? { ...createTokenReport(), fix } : createTokenReport());
  }
  if (name === 'scan_governance') return toolResult(createGovernanceReport());

  throw new Error(`Unknown tool: ${name}`);
}

function toolResult(report) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(report, null, 2),
      },
    ],
  };
}

function result(id, value) {
  return {
    jsonrpc: '2.0',
    id,
    result: value,
  };
}

function error(id, code, message) {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
    },
  };
}

function send(message) {
  if (!message) return;
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

rl.on('line', line => {
  if (!line.trim()) return;

  try {
    send(handleRequest(JSON.parse(line)));
  } catch (err) {
    send(error(null, -32700, err instanceof Error ? err.message : String(err)));
  }
});
