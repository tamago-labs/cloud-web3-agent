import React, { useState, useEffect, useContext, useCallback } from 'react';
import { BarChart3, FileText, Eye, Trash2, TrendingUp, X, EyeOff } from 'lucide-react';

import { AccountContext } from '@/contexts/account';
import { artifactAPI } from '@/lib/api';
import ChartView from '../../ChartView';


interface RightPanelProps {
    refreshTrigger?: number;
    onArtifactUpdate?: () => void;
}

const SideOutput: React.FC<RightPanelProps> = ({
    refreshTrigger = 0,
    onArtifactUpdate
}) => {

    const { profile } = useContext(AccountContext);
    const [selectedChart, setSelectedChart] = useState<any>(null);
    const [showChartModal, setShowChartModal] = useState(false);
    const [artifacts, setArtifacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        profile && loadArtifacts(profile?.id);
    }, [profile, refreshTrigger]);

    // Load artifacts from database
    const loadArtifacts = async (profileId: string | undefined) => {
        if (!profileId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const userArtifacts = await artifactAPI.getUserArtifacts(profileId);
            console.log("Loaded artifacts:", userArtifacts);
            setArtifacts(userArtifacts);
            setError(null);
        } catch (err) {
            console.error('Error loading artifacts:', err);
            setError('Failed to load artifacts');
        } finally {
            setLoading(false);
        }
    };

    // Handle chart viewing
    const handleViewChart = (chart: any) => {
        console.log('🔍 Viewing chart:', chart);
        setSelectedChart(chart);
        setShowChartModal(true);
    };

    // Handle artifact deletion
    const handleDeleteArtifact = useCallback(async (artifactId: string) => {
        try {
            await artifactAPI.deleteArtifact(artifactId);
            setArtifacts(prev => prev.filter(artifact => artifact.id !== artifactId));

            if (selectedChart?.id === artifactId) {
                setShowChartModal(false);
                setSelectedChart(null);
            }

            if (onArtifactUpdate) {
                onArtifactUpdate();
            }

            console.log('✅ Artifact deleted successfully');
        } catch (error) {
            console.error('❌ Error deleting artifact:', error);
            alert('Failed to delete artifact. Please try again.');
        }
    }, [selectedChart, onArtifactUpdate])

    const handleToggleVisibility = useCallback(async (artifactId: string, currentStatus: boolean) => {
        try {
            await artifactAPI.updateArtifact(artifactId, {
                isPublic: !currentStatus
            });

            // Update local state immediately
            setArtifacts(prev => prev.map(artifact =>
                artifact.id === artifactId
                    ? { ...artifact, isPublic: !currentStatus }
                    : artifact
            ));

            // Update chart modal if it's currently viewing this artifact
            if (selectedChart?.id === artifactId) {
                setSelectedChart((prev: any) => ({ ...prev, isPublic: !currentStatus }));
            }

            // Notify parent component
            if (onArtifactUpdate) {
                onArtifactUpdate();
            }

            console.log('✅ Visibility toggled successfully');
        } catch (error) {
            console.error('❌ Error toggling visibility:', error);
            alert('Failed to update visibility. Please try again.');
        }
    }, [onArtifactUpdate, selectedChart])

    // Chart Modal Component
    const ChartModal = ({ chart, isOpen, onClose }: { chart: any; isOpen: boolean; onClose: () => void }) => {
        if (!isOpen || !chart) return null;

        return (
            <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{chart.title}</h2>
                            <p className="text-gray-600 text-sm mt-1">{chart.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Toggle Public/Private Button */}
                            <button
                                onClick={() => handleToggleVisibility(chart.id, chart.isPublic)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${chart.isPublic
                                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                    }`}
                                title={chart.isPublic ? 'Make Private' : 'Make Public'}
                            >
                                <div className="flex items-center gap-1">
                                    {chart.isPublic ? (
                                        <>
                                            <Eye className="w-3 h-3" />
                                            Public
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff className="w-3 h-3" />
                                            Private
                                        </>
                                    )}
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    onClose();
                                    handleDeleteArtifact(chart.id);
                                }}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete artifact"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Chart Content */}
                    <div className="p-6">
                        <div className="mb-6">
                            <ChartView
                                data={chart.data}
                                chartType={chart.chartType}
                                trend={chart.change?.includes('+') ? 'up' : 'down'}
                            />
                        </div>

                        {/* Chart Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Details</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Type:</span>
                                        <span className="font-medium capitalize">{chart.chartType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Data Points:</span>
                                        <span className="font-medium">{chart.data?.length || 0}</span>
                                    </div>
                                    {chart.totalValue && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Value:</span>
                                            <span className="font-medium">{chart.totalValue}</span>
                                        </div>
                                    )}
                                    {chart.change && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Change:</span>
                                            <span className={`font-medium ${chart.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                                                {chart.change}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Visibility:</span>
                                        <span className="font-medium">{chart.isPublic ? 'Public' : 'Private'}</span>
                                    </div>
                                    {chart.category && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Category:</span>
                                            <span className="font-medium">{chart.category}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Points</h3>
                                <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                                    <div className="space-y-2">
                                        {chart.data?.map((point: any, index: number) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    {point.color && (
                                                        <div
                                                            className="w-3 h-3 rounded-full border border-gray-300"
                                                            style={{ backgroundColor: point.color }}
                                                        />
                                                    )}
                                                    <span className="text-sm text-gray-600">{point.name}</span>
                                                </div>
                                                <span className="text-sm font-medium">{point.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Generated Artifacts</h3>
                            <span className="text-xs text-gray-500">{artifacts.length} items</span>
                        </div>

                        {/* Check for profile first - if no profile, show login message */}
        {!profile ? (
            <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-sm font-medium mb-2">Login Required</p>
                <p className="text-gray-500 text-xs">
                    Please log in to view and manage your artifacts
                </p>
            </div>
        ) : loading ? (
            <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        ) : error ? (
            <div className="text-center py-8">
                <p className="text-red-600 text-sm">{error}</p>
                <button
                    onClick={() => loadArtifacts(profile?.id)}
                    className="mt-2 text-blue-600 text-sm hover:text-blue-800"
                >
                    Try again
                </button>
            </div>
        ) : artifacts.length === 0 ? (
            <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No charts created yet</p>
                <p className="text-gray-400 text-xs mt-1">
                    Start a conversation and convert it to a chart
                </p>
            </div>
        ) : (
            <div className="space-y-3">
                {artifacts.map((artifact) => (
                    <div
                        key={artifact.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => handleViewChart(artifact)}
                    >
                        {/* Header with title and actions */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 text-sm truncate">
                                    {artifact.title}
                                </h4>
                                {artifact.description && (
                                    <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                                        {artifact.description}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteArtifact(artifact.id);
                                    }}
                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Card content without chart preview */}
                        <div className="space-y-3">
                            {/* Chart metadata */}
                            <div className="flex items-center justify-between text-xs text-gray-600">
                                <span className="capitalize font-medium">
                                    {artifact.chartType} chart
                                </span>
                                <span>
                                    {artifact.data?.length || 0} data points
                                </span>
                            </div>

                            {/* Values display */}
                            {(artifact.totalValue || artifact.change) && (
                                <div className="flex items-center justify-between">
                                    {artifact.totalValue && (
                                        <span className="text-sm font-semibold text-gray-900">
                                            {artifact.totalValue}
                                        </span>
                                    )}
                                    {artifact.change && (
                                        <span className={`text-xs font-medium flex items-center gap-1 ${artifact.change.includes('+') ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {artifact.change.includes('+') ? (
                                                <TrendingUp className="w-3 h-3" />
                                            ) : (
                                                <TrendingUp className="w-3 h-3 transform rotate-180" />
                                            )}
                                            {artifact.change}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Status and category row */}
                            <div className="flex items-center justify-between">
                                {/* Enhanced Public/Private Badge */}
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${artifact.isPublic
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-gray-50 text-gray-700 border-gray-200'
                                    }`}>
                                    {artifact.isPublic ? (
                                        <>
                                            <Eye className="w-3 h-3" />
                                            Public
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff className="w-3 h-3" />
                                            Private
                                        </>
                                    )}
                                </span>

                                {/* Category */}
                                {artifact.category && (
                                    <span className="text-xs text-gray-500 truncate max-w-24">
                                        {artifact.category}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
                    </div>
                </div>
            </div>

            {/* Chart Modal */}
            <ChartModal
                chart={selectedChart}
                isOpen={showChartModal}
                onClose={() => {
                    setShowChartModal(false);
                    setSelectedChart(null);
                }}
            />
        </div>)
}

export default SideOutput