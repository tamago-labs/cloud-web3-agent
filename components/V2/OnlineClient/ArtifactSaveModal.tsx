import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Minus, Eye, EyeOff } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, BarChart as RechartsBar, Bar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, Area, AreaChart } from 'recharts';
 

interface ArtifactSaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingArtifact: any;
    onSave: (artifactData: any) => Promise<void>;
    isSaving?: boolean;
}

const ArtifactSaveModal: React.FC<ArtifactSaveModalProps> = ({
    isOpen,
    onClose,
    editingArtifact,
    onSave,
    isSaving = false
}) => {
    // Form state
    const [formData, setFormData] = useState<any>({
        title: '',
        description: '',
        category: 'Portfolio Analytics',
        chartType: 'pie',
        data: [],
        totalValue: '',
        change: '',
        tags: [],
        isPublic: false
    });

    // Form validation and UI state
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [currentTag, setCurrentTag] = useState<any>('');
    const [tempDataPoint, setTempDataPoint] = useState({ name: '', value: 0 });

    // Initialize form when editingArtifact changes
    useEffect(() => {
        if (editingArtifact) {
            setFormData({
                title: editingArtifact.title || '',
                description: editingArtifact.description || '',
                category: editingArtifact.category || 'Portfolio Analytics',
                chartType: editingArtifact.type || editingArtifact.chartType || 'pie',
                data: editingArtifact.data || [],
                totalValue: editingArtifact.totalValue || '',
                change: editingArtifact.change || '',
                tags: editingArtifact.tags || [],
                isPublic: editingArtifact.isPublic || false
            });
        }
    }, [editingArtifact]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setErrors({});
            setCurrentTag('');
            setTempDataPoint({ name: '', value: 0 });
        }
    }, [isOpen]);

    // Validation function
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.chartType) {
            newErrors.chartType = 'Chart type is required';
        }

        if (!formData.data || formData.data.length === 0) {
            newErrors.data = 'At least one data point is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle save
    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            const artifactData = {
                ...formData,
                chartType: formData.chartType === 'type' ? 'pie' : formData.chartType
            };

            await onSave(artifactData);
            onClose();
        } catch (error) {
            console.error('Error saving artifact:', error);
        }
    };

    // Tag management
    const addTag = () => {
        if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
            setFormData((prev: any) => ({
                ...prev,
                tags: [...prev.tags, currentTag.trim()]
            }));
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData((prev: any) => ({
            ...prev,
            tags: prev.tags.filter((tag: any) => tag !== tagToRemove)
        }));
    };

    // Data point management
    const addDataPoint = () => {
        if (tempDataPoint.name.trim() && tempDataPoint.value > 0) {
            setFormData((prev: any) => ({
                ...prev,
                data: [...prev.data, { 
                    name: tempDataPoint.name.trim(), 
                    value: tempDataPoint.value,
                    color: generateChartColor(prev.data.length)
                }]
            }));
            setTempDataPoint({ name: '', value: 0 });
        }
    };

    const updateDataPoint = (index: number, field: 'name' | 'value', value: string | number) => {
        setFormData((prev: any) => ({
            ...prev,
            data: prev.data.map((item: any, i: number) => 
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const removeDataPoint = (index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            data: prev.data.filter((_: any, i: number) => i !== index)
        }));
    };

    // Generate chart colors
    const generateChartColor = (index: number): string => {
        const colors = [
            '#627EEA', '#2775CA', '#F7931A', '#6B7280', '#10B981',
            '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'
        ];
        return colors[index % colors.length];
    };

    // Professional Chart Preview Component
    const ChartPreview = ({ data, chartType }: { data: any[], chartType: string }) => {
        if (!data || data.length === 0) {
            return (
                <div className="h-48 w-full flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-gray-500">Add data points to see preview</p>
                </div>
            );
        }

        if (chartType === 'pie') {
            return (
                <div className="h-48 w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                    <ResponsiveContainer width="90%" height="90%">
                        <RechartsPie>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={0}
                                outerRadius={70}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} fontSize={12} />
                        </RechartsPie>
                    </ResponsiveContainer>
                </div>
            );
        }

        if (chartType === 'bar') {
            return (
                <div className="h-48 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsBar data={data}>
                            <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                            <YAxis fontSize={12} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </RechartsBar>
                    </ResponsiveContainer>
                </div>
            );
        }

        // Default line chart
        return (
            <div className="h-48 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                        <YAxis fontSize={12} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ zIndex: 10000 }}>
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {editingArtifact?.id ? 'Edit Artifact' : 'Save Artifact'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isSaving}
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex max-h-[calc(90vh-140px)]">
                    {/* Left Side - Preview */}
                    <div className="w-1/2 p-6 border-r border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Preview</h3>
                        <ChartPreview data={formData.data} chartType={formData.chartType} />
                        
                        {/* Chart Info */}
                        <div className="mt-4 space-y-2">
                            <div className="text-lg font-bold text-gray-900">
                                {formData.title || 'Untitled Chart'}
                            </div>
                            {formData.totalValue && (
                                <div className="text-xl font-bold text-gray-900">{formData.totalValue}</div>
                            )}
                            {formData.change && (
                                <div className={`text-sm font-medium ${
                                    formData.change.includes('+') ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {formData.change}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-1/2 p-6 overflow-y-auto">
                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter chart title..."
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Describe your chart..."
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData((prev: any) => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Portfolio Analytics">Portfolio Analytics</option>
                                    <option value="DeFi Analytics">DeFi Analytics</option>
                                    <option value="Gas Analytics">Gas Analytics</option>
                                    <option value="Bitcoin Analytics">Bitcoin Analytics</option>
                                    <option value="NFT Analytics">NFT Analytics</option>
                                    <option value="Cross-Chain Analytics">Cross-Chain Analytics</option>
                                    <option value="Aptos Analytics">Aptos Analytics</option>
                                    <option value="Whale Analytics">Whale Analytics</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Chart Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Chart Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.chartType}
                                    onChange={(e) => setFormData((prev: any) => ({ ...prev, chartType: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="pie">Pie Chart</option>
                                    <option value="bar">Bar Chart</option>
                                    <option value="line">Line Chart</option>
                                    <option value="area">Area Chart</option>
                                    <option value="donut">Donut Chart</option>
                                    <option value="horizontal_bar">Horizontal Bar Chart</option>
                                </select>
                                {errors.chartType && <p className="mt-1 text-sm text-red-600">{errors.chartType}</p>}
                            </div>

                            {/* Total Value & Change */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Value
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.totalValue}
                                        onChange={(e) => setFormData((prev : any) => ({ ...prev, totalValue: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., $14,213"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Change
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.change}
                                        onChange={(e) => setFormData((prev : any) => ({ ...prev, change: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., +12.4%"
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tags
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={currentTag}
                                        onChange={(e) => setCurrentTag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Add a tag..."
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag: any, index: number) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Data Points */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Data Points <span className="text-red-500">*</span>
                                </label>
                                
                                {/* Add new data point */}
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={tempDataPoint.name}
                                        onChange={(e) => setTempDataPoint(prev => ({ ...prev, name: e.target.value }))}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Label"
                                    />
                                    <input
                                        type="number"
                                        value={tempDataPoint.value}
                                        onChange={(e) => setTempDataPoint(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Value"
                                    />
                                    <button
                                        type="button"
                                        onClick={addDataPoint}
                                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Existing data points */}
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {formData.data.map((item: any, index: number) => (
                                        <div key={index} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg">
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={(e) => updateDataPoint(index, 'name', e.target.value)}
                                                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <input
                                                type="number"
                                                value={item.value}
                                                onChange={(e) => updateDataPoint(index, 'value', parseFloat(e.target.value) || 0)}
                                                className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeDataPoint(index)}
                                                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {errors.data && <p className="mt-1 text-sm text-red-600">{errors.data}</p>}
                            </div>

                            {/* Visibility */}
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isPublic}
                                        onChange={(e) => setFormData((prev: any) => ({ ...prev, isPublic: e.target.checked }))}
                                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        {formData.isPublic ? (
                                            <><Eye className="w-4 h-4" /> Make Public (visible in Discover page)</>
                                        ) : (
                                            <><EyeOff className="w-4 h-4" /> Keep Private (only you can see)</>
                                        )}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 rounded-b-2xl">
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Artifact
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtifactSaveModal;