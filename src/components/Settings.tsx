import React, { useEffect, useCallback } from 'react';
import { Key, Lock } from 'lucide-react';
import { storage } from '../utils/storage';

interface SettingsProps {
  apiKeys: {
    openai: string;
    stability: string;
    replicate: string;
    anthropic: string;
    luma: string;
    clipdrop: string;
  };
  onApiKeyChange: (provider: string, key: string) => void;
}

export function Settings({ apiKeys, onApiKeyChange }: SettingsProps) {
  // Memoize the loadApiKeys function
  const loadApiKeys = useCallback(() => {
    const providers = ['openai', 'stability', 'replicate', 'anthropic', 'luma', 'clipdrop'];
    providers.forEach(provider => {
      const savedKey = storage.getApiKey(provider);
      if (savedKey && savedKey !== apiKeys[provider as keyof typeof apiKeys]) {
        onApiKeyChange(provider, savedKey);
      }
    });
  }, [onApiKeyChange, apiKeys]);

  // Load saved API keys on mount only
  useEffect(() => {
    loadApiKeys();
  }, [loadApiKeys]);

  const apiKeyInputs = [
    { provider: 'openai', label: 'OpenAI API Key', placeholder: 'sk-...' },
    { provider: 'stability', label: 'Stability AI API Key', placeholder: 'sk-...' },
    { provider: 'replicate', label: 'Replicate API Key', placeholder: 'r8_...' },
    { provider: 'anthropic', label: 'Anthropic API Key', placeholder: 'sk-ant-...' },
    { provider: 'luma', label: 'Luma API Key', placeholder: 'luma_...' },
    { provider: 'clipdrop', label: 'ClipDrop API Key', placeholder: 'cd_...' }
  ];

  const handleSave = () => {
    // Save API keys to storage
    Object.entries(apiKeys).forEach(([provider, key]) => {
      if (key) {
        storage.setApiKey(provider, key);
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1a1a1a] text-white">
      {/* Fixed Header */}
      <div className="p-4 border-b border-[#333] bg-[#1a1a1a] sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Key size={20} className="text-gray-400" />
          <h2 className="text-xl font-semibold">Settings</h2>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6 space-y-8">
          {/* API Keys Section */}
          <div className="bg-[#242424] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-6">API Keys</h3>
            <div className="space-y-6">
              {apiKeyInputs.map(({ provider, label, placeholder }) => (
                <div key={provider} className="group">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={apiKeys[provider as keyof typeof apiKeys] || ''}
                      onChange={(e) => onApiKeyChange(provider, e.target.value)}
                      placeholder={placeholder}
                      className="w-full bg-[#333] text-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#45caff] placeholder-gray-500 transition-all duration-300 border border-transparent group-hover:border-[#45caff]/20"
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </div>
              ))}

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-gradient-to-r from-[#ff1b6b] to-[#45caff] text-white rounded-lg hover:opacity-90 transition-opacity relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                  <span className="relative">Save Changes</span>
                </button>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-[#242424] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Security</h3>
            <p className="text-gray-400">
              Your API keys are stored locally in your browser and are never sent to our servers.
              Please ensure you keep your API keys secure and never share them with anyone.
            </p>
          </div>

          {/* Additional Settings Sections */}
          <div className="bg-[#242424] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Theme</h3>
            <p className="text-gray-400 mb-4">
              Customize the appearance of your workspace.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Dark Mode</span>
                <div className="w-11 h-6 bg-[#333] rounded-full relative cursor-pointer">
                  <div className="absolute w-5 h-5 bg-[#45caff] rounded-full left-0.5 top-0.5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Animations</span>
                <div className="w-11 h-6 bg-[#333] rounded-full relative cursor-pointer">
                  <div className="absolute w-5 h-5 bg-[#45caff] rounded-full left-0.5 top-0.5" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#242424] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Editor</h3>
            <p className="text-gray-400 mb-4">
              Configure your editing experience.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto Save</span>
                <div className="w-11 h-6 bg-[#333] rounded-full relative cursor-pointer">
                  <div className="absolute w-5 h-5 bg-[#45caff] rounded-full left-0.5 top-0.5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Line Numbers</span>
                <div className="w-11 h-6 bg-[#333] rounded-full relative cursor-pointer">
                  <div className="absolute w-5 h-5 bg-[#45caff] rounded-full left-0.5 top-0.5" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#242424] rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Privacy</h3>
            <p className="text-gray-400 mb-4">
              Manage your privacy settings and data.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Usage Analytics</span>
                <div className="w-11 h-6 bg-[#333] rounded-full relative cursor-pointer">
                  <div className="absolute w-5 h-5 bg-[#45caff] rounded-full left-0.5 top-0.5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Error Reporting</span>
                <div className="w-11 h-6 bg-[#333] rounded-full relative cursor-pointer">
                  <div className="absolute w-5 h-5 bg-[#45caff] rounded-full left-0.5 top-0.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}