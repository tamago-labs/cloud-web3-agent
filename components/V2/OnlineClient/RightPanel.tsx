import React, { useState } from 'react';
import { BarChart3, FileText, Download, Share2, Eye, Trash2, Calendar, TrendingUp, PieChart, Activity, Table, Map, Code } from 'lucide-react';

const RightPanel = () => {
    const [activeTab, setActiveTab] = useState('artifacts');
    const [selectedArtifact, setSelectedArtifact] = useState<any>(null);

    // Empty artifacts array - will be populated when real artifacts are generated
    const artifacts: any[] = [];

    // Empty activity logs - will be populated when real MCP calls are made
    const mcpLogs: any[] = [];

    const getArtifactTypeColor = (type: any) => {
        switch (type) {
            case 'chart': return 'from-blue-500 to-cyan-500';
            case 'report': return 'from-green-500 to-emerald-500';
            case 'table': return 'from-purple-500 to-indigo-500';
            case 'map': return 'from-orange-500 to-red-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const ArtifactPreview = ({ artifact }: any) => (
        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-lg bg-gradient-to-r ${getArtifactTypeColor(artifact.type)} flex items-center justify-center text-white`}>
                    {artifact.icon}
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{artifact.title}</h4>
                <p className="text-xs text-gray-600 mb-3">{artifact.preview}</p>
                <div className="flex gap-2 justify-center">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        View
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        Export
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            {/* Right Panel Tabs */}
          {/*  <div className="border-b border-gray-200 p-4">
                <div className="flex rounded-lg bg-gray-100 p-1">
                    <button
                        onClick={() => setActiveTab('artifacts')}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            activeTab === 'artifacts' 
                                ? 'bg-white text-gray-900 shadow-md border border-gray-200' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        Artifacts
                    </button>
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            activeTab === 'activity' 
                                ? 'bg-white text-gray-900 shadow-md border border-gray-200' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        Activity
                    </button>
                </div>
            </div>*/}

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'artifacts' && (
                    <div className="p-4">
                        {selectedArtifact ? (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={() => setSelectedArtifact(null)}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Back to Artifacts
                                    </button>
                                </div>
                                <ArtifactPreview artifact={artifacts.find(a => a.id === selectedArtifact)} />
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900">Generated Artifacts</h3>
                                    <span className="text-xs text-gray-500">{artifacts.length} items</span>
                                </div>

                                <div className="space-y-3">
                                    {artifacts.map((artifact) => (
                                        <div
                                            key={artifact.id}
                                            onClick={() => setSelectedArtifact(artifact.id)}
                                            className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all duration-200 group"
                                        >
                                            <div className="flex items-start gap-3">
                                               {/* <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getArtifactTypeColor(artifact.type)} flex items-center justify-center text-white flex-shrink-0`}>
                                                    {artifact.icon}
                                                </div>*/}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                                                        {artifact.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                        {artifact.description}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-xs text-gray-500">{artifact.createdAt}</span>
                                                        <span className="text-xs text-gray-500">{artifact.size}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/*<div className="mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-xs text-gray-600 mb-2">{artifact.preview}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        artifact.type === 'chart' ? 'bg-blue-100 text-blue-700' :
                                                        artifact.type === 'report' ? 'bg-green-100 text-green-700' :
                                                        'bg-purple-100 text-purple-700'
                                                    }`}>
                                                        {artifact.type}
                                                    </span>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                                                            <Eye className="w-3 h-3" />
                                                        </button>
                                                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                                                            <Download className="w-3 h-3" />
                                                        </button>
                                                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                                                            <Share2 className="w-3 h-3" />
                                                        </button>
                                                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>*/}
                                        </div>
                                    ))}
                                </div>

                                {artifacts.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <BarChart3 className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Artifacts Yet</h3>
                                        <p className="text-gray-600 text-sm mb-4 max-w-xs mx-auto">
                                            Ask the AI to generate charts, reports, or visualizations and they'll appear here
                                        </p>
                                        <div className="text-xs text-gray-500">
                                            Try: "Show me latest 3 blocks on Arbitrum"
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="p-4">
                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Recent Activity</h3>
                            <p className="text-sm text-gray-600">MCP server calls and generated artifacts</p>
                        </div>

                        {mcpLogs.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Activity className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Yet</h3>
                                <p className="text-gray-600 text-sm mb-4 max-w-xs mx-auto">
                                    Start chatting with AI to see MCP server activity here
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {mcpLogs.map((log, index) => (
                                    <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`w-2 h-2 rounded-full ${
                                                log.type === 'success' ? 'bg-green-500' : 
                                                log.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                            }`}></div>
                                            <span className="font-medium text-sm text-gray-900">{log.server}</span>
                                            <span className="text-xs text-gray-500 ml-auto">{log.timestamp}</span>
                                        </div>
                                        <div className="text-xs text-gray-600 font-mono ml-4 mb-1">{log.action}</div>
                                        <div className="text-xs text-gray-500 ml-4">
                                            → Generated: <span className="font-medium">{log.artifact}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-medium text-gray-900 mb-2">Available Tools</h4>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div>• Portfolio analysis across chains</div>
                                <div>• NFT collection insights</div>
                                <div>• DeFi analytics and liquidity pools</div>
                                <div>• Block and transaction data</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RightPanel;