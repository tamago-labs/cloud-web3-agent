import { MCPTestPanel } from '@/components/mcp/MCPTestPanel';

export default function MCPTestPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          MCP Integration Testing
        </h1>
        <MCPTestPanel />
      </div>
    </div>
  );
}
