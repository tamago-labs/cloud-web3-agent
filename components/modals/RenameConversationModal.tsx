import React, { useState, useEffect, useRef } from 'react';
import { X, Edit2, Check } from 'lucide-react';

interface RenameConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTitle: string;
    onSave: (newTitle: string) => Promise<void>;
    isSaving?: boolean;
}

const RenameConversationModal: React.FC<RenameConversationModalProps> = ({
    isOpen,
    onClose,
    currentTitle,
    onSave,
    isSaving = false
}) => {
    const [title, setTitle] = useState(currentTitle);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTitle(currentTitle);
        setError('');
    }, [currentTitle, isOpen]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isOpen]);

    const handleSave = async () => {
        const trimmedTitle = title.trim();
        
        if (!trimmedTitle) {
            setError('Title cannot be empty');
            return;
        }

        if (trimmedTitle.length > 100) {
            setError('Title must be less than 100 characters');
            return;
        }

        if (trimmedTitle === currentTitle) {
            onClose();
            return;
        }

        try {
            await onSave(trimmedTitle);
            onClose();
        } catch (error) {
            setError('Failed to rename conversation. Please try again.');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Edit2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Rename Conversation
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isSaving}
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Conversation Title
                        </label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setError('');
                            }}
                            onKeyPress={handleKeyPress}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                                error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="Enter conversation title..."
                            maxLength={100}
                            disabled={isSaving}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <span className={`text-xs ${error ? 'text-red-600' : 'text-gray-500'}`}>
                                {error || `${title.length}/100 characters`}
                            </span>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Tips:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Use descriptive titles for easy identification</li>
                            <li>• Include topic keywords (DeFi, Portfolio, Analysis)</li>
                            <li>• Keep it concise but meaningful</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !title.trim() || title.trim() === currentTitle}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RenameConversationModal;