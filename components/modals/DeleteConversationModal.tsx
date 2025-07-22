import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    conversationTitle: string;
    isDeleting?: boolean;
}

const DeleteConversationModal: React.FC<DeleteConversationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    conversationTitle,
    isDeleting = false
}) => {
    if (!isOpen) return null;

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onConfirm();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Delete Conversation
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isDeleting}
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 mb-3">
                            Are you sure you want to delete this conversation?
                        </p>
                        
                        {/* Conversation Title Display */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <Trash2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 text-sm mb-1">
                                        "{conversationTitle}"
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        This will permanently delete all messages and cannot be undone
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-medium text-red-800 mb-1">
                                        This action cannot be undone
                                    </h4>
                                    <p className="text-xs text-red-700">
                                        All messages, tool results, and conversation history will be permanently deleted from your account.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        disabled={isDeleting}
                        onKeyPress={handleKeyPress}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
                        onKeyPress={handleKeyPress}
                        autoFocus
                    >
                        {isDeleting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                Delete Conversation
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConversationModal;