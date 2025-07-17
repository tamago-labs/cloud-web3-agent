import React, { useState, useEffect, useContext } from 'react';
import { Edit3, BarChart3, FileText, Download, Share2, Eye, Trash2, Calendar, TrendingUp, PieChart, Activity, Table, Map, Code, X } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, BarChart as RechartsBar, Bar, Area, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart } from 'recharts';
import { AccountContext } from '@/contexts/account';
import { artifactAPI } from '@/lib/api';
// import ArtifactEditModal from './ArtifactEditModal';

interface RightPanelProps {
    refreshTrigger?: number;
    onArtifactUpdate?: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
    refreshTrigger = 0,
    onArtifactUpdate
}) => {

    const { profile } = useContext(AccountContext);
    const [activeTab, setActiveTab] = useState('artifacts');
    const [selectedChart, setSelectedChart] = useState<any>(null);
    const [showChartModal, setShowChartModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingArtifact, setEditingArtifact] = useState<any>(null);

    // Database artifacts state
    const [artifacts, setArtifacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load artifacts from database
    const loadArtifacts = async () => {
        if (!profile?.id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const userArtifacts = await artifactAPI.getUserArtifacts(profile.id);
            console.log("userArtifacts : ", userArtifacts)
            setArtifacts(userArtifacts);
            setError(null);
        } catch (err) {
            console.error('Error loading artifacts:', err);
            setError('Failed to load artifacts');
        } finally {
            setLoading(false);
        }
    };

    // Load artifacts on component mount, profile change, and refresh trigger
    useEffect(() => {
        console.log("load artifact...")
        loadArtifacts();
    }, [profile?.id, refreshTrigger]);


    // Handle chart viewing
    const handleViewChart = (chart: any) => {
        setSelectedChart(chart);
        setShowChartModal(true);
    };

    // Handle artifact editing
    const handleEditArtifact = (artifact: any) => {
        setEditingArtifact(artifact);
        setShowEditModal(true);
    };

    // Handle artifact deletion
    const handleDeleteArtifact = async (artifactId: string) => {
        if (!confirm('Are you sure you want to delete this artifact? This action cannot be undone.')) return;

        try {
            await artifactAPI.deleteArtifact(artifactId);

            // Update local state immediately
            setArtifacts(prev => prev.filter(artifact => artifact.id !== artifactId));

            // Close modal if currently viewing deleted artifact
            if (selectedChart?.id === artifactId) {
                setShowChartModal(false);
                setSelectedChart(null);
            }

            // Notify parent component
            if (onArtifactUpdate) {
                onArtifactUpdate();
            }

            console.log('Artifact deleted successfully');
        } catch (error) {
            console.error('Error deleting artifact:', error);
            alert('Failed to delete artifact. Please try again.');
        }
    };

    // Handle artifact update
    const handleUpdateArtifact = async (artifactData: any) => {
        if (!editingArtifact?.id) return;

        try {
            await artifactAPI.updateArtifact(editingArtifact.id, artifactData);

            // Update local state immediately
            setArtifacts(prev => prev.map(artifact =>
                artifact.id === editingArtifact.id
                    ? { ...artifact, ...artifactData }
                    : artifact
            ));

            // Close modal
            setShowEditModal(false);
            setEditingArtifact(null);

            // Update chart modal if it's currently viewing this artifact
            if (selectedChart?.id === editingArtifact.id) {
                setSelectedChart({ ...selectedChart, ...artifactData });
            }

            // Notify parent component
            if (onArtifactUpdate) {
                onArtifactUpdate();
            }

            console.log('Artifact updated successfully');
        } catch (error) {
            console.error('Error updating artifact:', error);
            throw error;
        }
    };

    // Professional Chart Component
    const ProfessionalChart = ({ data, chartType, trend }: { data: any[], chartType: string, trend?: string }) => {
        const trendColor = trend === 'up' ? '#10B981' : '#EF4444';

        if (!data || data.length === 0) {
            return (
                <div className="h-32 w-full flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-gray-500 text-xs">No data</p>
                </div>
            );
        }

        if (chartType === 'pie' || chartType === 'donut') {
            return (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                    <ResponsiveContainer width="90%" height="90%">
                        <RechartsPie>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={chartType === 'donut' ? 20 : 0}
                                outerRadius={40}
                                paddingAngle={1}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || `hsl(${index * 45}, 70%, 60%)`} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: any) => [`${value}`, 'Value']} />
                        </RechartsPie>
                    </ResponsiveContainer>
                </div>
            );
        }

        if (chartType === 'bar' || chartType === 'horizontal_bar') {
            return (
                <div className="h-full w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsBar data={data} layout={chartType === 'horizontal_bar' ? 'horizontal' : 'vertical'}>
                            <XAxis
                                dataKey="name"
                                fontSize={10}
                                axisLine={false}
                                tickLine={false}
                                type={chartType === 'horizontal_bar' ? 'number' : 'category'}
                            />
                            <YAxis
                                fontSize={10}
                                axisLine={false}
                                tickLine={false}
                                type={chartType === 'horizontal_bar' ? 'category' : 'number'}
                                dataKey={chartType === 'horizontal_bar' ? 'name' : undefined}
                            />
                            <Tooltip />
                            <Bar
                                dataKey="value"
                                fill="#3B82F6"
                                radius={2}
                            />
                        </RechartsBar>
                    </ResponsiveContainer>
                </div>
            );
        }

        if (chartType === 'area') {
            return (
                <div className="h-full w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={trendColor || '#3B82F6'} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={trendColor || '#3B82F6'} stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={trendColor || '#3B82F6'}
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            );
        }

        // Default line chart
        return (
            <div className="h-full w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={trendColor || '#3B82F6'}
                            strokeWidth={2}
                            dot={{ fill: trendColor || '#3B82F6', strokeWidth: 1, r: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    };


    // Chart Modal Component - NO PNG EXPORT
    const ChartModal = ({ chart, isOpen, onClose }: { chart: any; isOpen: boolean; onClose: () => void }) => {
        if (!isOpen || !chart) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{chart.title}</h2>
                            <p className="text-gray-600 text-sm mt-1">{chart.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    onClose();
                                    handleEditArtifact(chart);
                                }}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit artifact"
                            >
                                <Edit3 className="w-5 h-5" />
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
                        <div className="mb-6 h-64">
                            <ProfessionalChart
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
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Data</h3>
                                <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                                    <div className="space-y-2">
                                        {chart.data?.map((point: any, index: number) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">{point.name}</span>
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
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Generated Artifacts</h3>
                            <span className="text-xs text-gray-500">{artifacts.length} items</span>
                        </div>


                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-red-600 text-sm">{error}</p>
                                <button
                                    onClick={loadArtifacts}
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
                                        className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer group"
                                        onClick={() => handleViewChart(artifact)}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1">
                                                {artifact.title}
                                            </h4>
                                            <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditArtifact(artifact);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="w-3 h-3" />
                                                </button>
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

                                        <div className="mb-2">
                                            <div className="h-16 bg-gray-50 rounded border">
                                                <ProfessionalChart
                                                    data={artifact.data}
                                                    chartType={artifact.chartType}
                                                    trend={artifact.change?.includes('+') ? 'up' : 'down'}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span className="capitalize">{artifact.chartType}</span>
                                            <span className="flex items-center gap-1">
                                                {artifact.isPublic ? <Eye className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                                {artifact.isPublic ? 'Public' : 'Private'}
                                            </span>
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
                onClose={() => setShowChartModal(false)}
            />
        </div>
    );
};

export default RightPanel;