/**
 * Railway MCP Client for Next.js Integration
 * Connects to the deployed Railway MCP service
 */

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

export interface MCPCallResult {
  success: boolean;
  result: any;
  serverName: string;
  toolName: string;
}

export class RailwayMCPClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.MCP_SERVICE_URL || 'https://decentral-mcp-server-production.up.railway.app';
    this.apiKey = process.env.MCP_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('MCP_API_KEY not found in environment variables');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`MCP API call failed (${response.status}): ${errorText}`);
    }

    return await response.json();
  }

  async healthCheck(): Promise<any> {
    try {
      // Health endpoint doesn't require API key
      const response = await fetch(`${this.baseUrl}/health`);
      return await response.json();
    } catch (error) {
      console.error('MCP health check failed:', error);
      throw error;
    }
  }

  async connectServer(serverName: string, config?: any): Promise<void> {
    console.log(`[MCP] Connecting to server: ${serverName}`);
    
    try {
      await this.makeRequest('/api/mcp/connect', {
        method: 'POST',
        body: JSON.stringify({
          serverName,
          config
        })
      });
      
      console.log(`[MCP] Successfully connected to ${serverName}`);
    } catch (error) {
      console.error(`[MCP] Failed to connect to ${serverName}:`, error);
      throw error;
    }
  }

  async disconnectServer(serverName: string): Promise<void> {
    console.log(`[MCP] Disconnecting from server: ${serverName}`);
    
    try {
      await this.makeRequest(`/api/mcp/disconnect/${serverName}`, {
        method: 'DELETE'
      });
      
      console.log(`[MCP] Successfully disconnected from ${serverName}`);
    } catch (error) {
      console.error(`[MCP] Failed to disconnect from ${serverName}:`, error);
      throw error;
    }
  }

  async listServers(): Promise<{ connected: string[]; registered: string[]; status: any[] }> {
    try {
      const result = await this.makeRequest('/api/mcp/servers');
      return result;
    } catch (error) {
      console.error('[MCP] Failed to list servers:', error);
      throw error;
    }
  }

  async listTools(): Promise<Record<string, MCPTool[]>> {
    try {
      const result = await this.makeRequest('/api/mcp/tools');
      return result.tools || {};
    } catch (error) {
      console.error('[MCP] Failed to list tools:', error);
      return {};
    }
  }

  async callTool(serverName: string, toolName: string, arguments_: any): Promise<any> {
    console.log(`[MCP] Calling tool: ${serverName}.${toolName}`, { arguments: arguments_ });
    
    try {
      const result = await this.makeRequest('/api/mcp/tools/call', {
        method: 'POST',
        body: JSON.stringify({
          serverName,
          toolName,
          arguments: arguments_
        })
      });

      console.log(`[MCP] Tool ${toolName} completed successfully`);
      return result.result;
    } catch (error) {
      console.error(`[MCP] Tool ${toolName} failed:`, error);
      throw error;
    }
  }

  async listResources(): Promise<Record<string, any[]>> {
    try {
      const result = await this.makeRequest('/api/mcp/resources');
      return result.resources || {};
    } catch (error) {
      console.error('[MCP] Failed to list resources:', error);
      return {};
    }
  }

  async readResource(serverName: string, uri: string): Promise<any> {
    console.log(`[MCP] Reading resource: ${serverName} - ${uri}`);
    
    try {
      const result = await this.makeRequest('/api/mcp/resources/read', {
        method: 'POST',
        body: JSON.stringify({
          serverName,
          uri
        })
      });

      console.log(`[MCP] Resource read successfully from ${serverName}`);
      return result.content;
    } catch (error) {
      console.error(`[MCP] Failed to read resource from ${serverName}:`, error);
      throw error;
    }
  }

  // Utility method to get tools formatted for Claude
  async getClaudeTools(): Promise<any[]> {
    try {
      const allTools = await this.listTools();
      const claudeTools: any[] = [];

      for (const [serverName, tools] of Object.entries(allTools)) {
        for (const tool of tools) {
          claudeTools.push({
            name: `${serverName}__${tool.name}`,
            description: `${tool.description} (via ${serverName})`,
            input_schema: tool.inputSchema || { 
              type: 'object', 
              properties: {},
              required: []
            }
          });
        }
      }

      return claudeTools;
    } catch (error) {
      console.error('[MCP] Error getting Claude tools:', error);
      return [];
    }
  }

  // Execute tool with parsed name
  async executeClaudeTool(toolName: string, input: any): Promise<any> {
    // Parse tool name to extract server and tool
    const parts = toolName.split('__');
    if (parts.length !== 2) {
      throw new Error(`Invalid tool name format: ${toolName}. Expected format: serverName__toolName`);
    }

    const [serverName, actualToolName] = parts;
    return await this.callTool(serverName, actualToolName, input);
  }

  // Initialize common MCP servers
  async initializeServers(serverNames: string[] = ['filesystem', 'web3-mcp']): Promise<void> {
    console.log(`[MCP] Initializing servers: ${serverNames.join(', ')}`);
    
    for (const serverName of serverNames) {
      try {
        // Check if already connected
        const servers = await this.listServers();
        if (servers.connected.includes(serverName)) {
          console.log(`[MCP] Server ${serverName} already connected`);
          continue;
        }

        await this.connectServer(serverName);
      } catch (error) {
        console.warn(`[MCP] Failed to initialize ${serverName}, continuing with others:`, error);
      }
    }
  }

  // Get service status
  async getStatus(): Promise<any> {
    try {
      const [health, servers] = await Promise.all([
        this.healthCheck(),
        this.listServers()
      ]);

      return {
        healthy: health.status === 'healthy',
        connectedServers: servers.connected,
        registeredServers: servers.registered,
        timestamp: new Date().toISOString(),
        serviceUrl: this.baseUrl
      };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        serviceUrl: this.baseUrl
      };
    }
  }
}

// Singleton instance
let mcpClient: RailwayMCPClient | null = null;

export function getMCPClient(): RailwayMCPClient {
  if (!mcpClient) {
    mcpClient = new RailwayMCPClient();
  }
  return mcpClient;
}

export default RailwayMCPClient;
