"use client";

import React from 'react';
import ToolSelector from '@/components/Dashboard/Tools/ToolSelector';

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="text-center lg:text-left">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Tool Configuration
        </h1>
        <p className="text-lg text-teal-200 max-w-3xl">
          Select and configure which MCP tools are available in your client applications
        </p>
      </div> */}

      {/* Tool Configuration Interface */}
      <ToolSelector />
    </div>
  );
}