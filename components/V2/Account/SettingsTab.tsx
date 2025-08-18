import React from 'react';
import { Save } from 'lucide-react';

interface SettingsTabProps {
    displayName: string;
    onDisplayNameChange: (name: string) => void;
    onSave: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
    displayName,
    onDisplayNameChange,
    onSave
}) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>

            {/* Profile Settings */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => onDisplayNameChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <button
                        onClick={onSave}
                        className="mt-2 cursor-pointer gap-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Security Settings */}
            <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                            <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
                        </div>
                        <button className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors">
                            Enable
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <div className="font-medium text-gray-900">API Keys</div>
                            <div className="text-sm text-gray-600">Manage your API access keys</div>
                        </div>
                        <button className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors">
                            Manage
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
