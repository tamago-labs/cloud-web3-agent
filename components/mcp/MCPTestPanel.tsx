'use client';

import React, { useState, useEffect } from 'react';

interface MCPStatus {
  healthy: boolean;
  connectedServers: string[];
  registeredServers: string[];
  serviceUrl: string;
  error?: string;
}

interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

export function MCPTestPanel() {
  const [status, setStatus] = useState<MCPStatus | null>(null);
  const [tools, setTools] = useState<Record<string, MCPTool[]>>({});
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mcp');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data.status);
      } else {
        setStatus({ 
          healthy: false, 
          connectedServers: [], 
          registeredServers: [], 
          serviceUrl: '',
          error: data.error 
        });
      }
    } catch (error) {
      console.error('Failed to load MCP status:', error);
      setStatus({ 
        healthy: false, 
        connectedServers: [], 
        registeredServers: [], 
        serviceUrl: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTools = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mcp/tools');
      const data = await response.json();
      
      if (data.success) {
        setTools(data.tools);
      } else {
        setTestResult(`Error loading tools: ${data.error}`);
      }
    } catch (error) {
      setTestResult(`Failed to load tools: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const connectServer = async (serverName: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'connect',
          serverName
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setTestResult(`✅ Connected to ${serverName}`);
        await loadStatus(); // Refresh status
      } else {
        setTestResult(`❌ Failed to connect to ${serverName}: ${data.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const initializeServers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'initialize',
          serverName: ['filesystem', 'web3-mcp', 'nodit']
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setTestResult(`✅ Initialized servers: ${data.servers.join(', ')}`);
        await loadStatus(); // Refresh status
      } else {
        setTestResult(`❌ Failed to initialize servers: ${data.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Initialization error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testFileSystem = async () => {
    setLoading(true);
    try {
      // Write a test file
      const writeResponse = await fetch('/api/mcp/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverName: 'filesystem',
          toolName: 'write_file',
          arguments: {
            path: '/tmp/mcp-test.txt',
            contents: `MCP Test File\nCreated at: ${new Date().toISOString()}\nTest successful!`
          }
        })
      });

      const writeData = await writeResponse.json();
      
      if (!writeData.success) {
        setTestResult(`❌ Write failed: ${writeData.error}`);
        return;
      }

      // Read the file back
      const readResponse = await fetch('/api/mcp/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverName: 'filesystem',
          toolName: 'read_file',
          arguments: {
            path: '/tmp/mcp-test.txt'
          }
        })
      });

      const readData = await readResponse.json();
      
      if (readData.success) {
        const content = readData.result?.content?.[0]?.text || 'No content';
        setTestResult(`✅ Filesystem test successful!\n\nFile content:\n${content}`);
      } else {
        setTestResult(`❌ Read failed: ${readData.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Filesystem test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testChat = async () => {
    setLoading(true);
    setTestResult('🔄 Testing MCP-enabled chat...\n\n');
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [],
          currentMessage: 'Can you create a file called /tmp/hello-mcp.txt with the content "Hello from MCP!" and then read it back to me?',
          enableMCP: true
        })
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                setTestResult(prev => prev + `❌ Error: ${data.error}\n`);
                break;
              }
              
              if (data.done) {
                setTestResult(prev => prev + '\n✅ MCP chat test completed!');
                break;
              }
              
              if (data.chunk) {
                fullResponse += data.chunk;
                setTestResult(prev => prev + data.chunk);
              }
            } catch (error) {
              console.error('Failed to parse response:', error);
            }
          }
        }
      }
    } catch (error) {
      setTestResult(prev => prev + `\n❌ Chat test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">MCP Integration Test Panel</h2>
        
        {/* Status Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Service Status</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            {loading && <div className="text-blue-600">Loading...</div>}
            {status && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${status.healthy ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="font-medium">
                    {status.healthy ? 'Healthy' : 'Unhealthy'}
                  </span>
                </div>
                <div>
                  <strong>Service URL:</strong> {status.serviceUrl}
                </div>
                <div>
                  <strong>Connected Servers:</strong> {status.connectedServers.join(', ') || 'None'}
                </div>
                <div>
                  <strong>Registered Servers:</strong> {status.registeredServers.join(', ') || 'None'}
                </div>
                {status.error && (
                  <div className="text-red-600">
                    <strong>Error:</strong> {status.error}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Controls Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Controls</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={loadStatus}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Refresh Status
            </button>
            <button
              onClick={initializeServers}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              Initialize Servers
            </button>
            <button
              onClick={loadTools}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
            >
              Load Tools
            </button>
            <button
              onClick={testFileSystem}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
            >
              Test Filesystem
            </button>
            <button
              onClick={testChat}
              disabled={loading}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50 col-span-2"
            >
              Test MCP Chat
            </button>
          </div>
        </div>

        {/* Server Connection Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Quick Connect</h3>
          <div className="flex flex-wrap gap-2">
            {['filesystem', 'web3-mcp', 'nodit'].map(serverName => (
              <button
                key={serverName}
                onClick={() => connectServer(serverName)}
                disabled={loading}
                className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 text-sm"
              >
                Connect {serverName}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Section */}
        {Object.keys(tools).length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Available Tools</h3>
            <div className="space-y-3">
              {Object.entries(tools).map(([serverName, serverTools]) => (
                <div key={serverName} className="bg-gray-50 p-3 rounded-md">
                  <h4 className="font-medium text-gray-800 mb-2">{serverName}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {serverTools.map(tool => (
                      <div key={tool.name} className="text-sm">
                        <span className="font-medium">{tool.name}</span>
                        <span className="text-gray-600 ml-2">{tool.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        {testResult && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Test Results</h3>
            <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
              {testResult}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
