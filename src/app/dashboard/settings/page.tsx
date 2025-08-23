'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { Users, BookOpen, Shield, CheckCircle, XCircle } from 'lucide-react';
import ApiClient from '@/utils/api';

// Types for better TypeScript support
interface Settings {
  newRegistrations: boolean;
  locationRequired: boolean;
  articleSharing: boolean;
  articleExport: boolean;
  registrationLimit: string;
  articleReadLimit: string;
}

// Define the API response type
interface ApiResponse<T = any> {
  data: {
    success: boolean;
    settings?: T;
    error?: string;
    message?: string;
  };
  status: number;
  statusText: string;
  headers: any;
  config: any;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    newRegistrations: true,
    locationRequired: true,
    articleSharing: true,
    articleExport: false,
    registrationLimit: '100',
    articleReadLimit: '5'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch settings from backend on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use ApiClient to fetch settings with proper typing
      const response: ApiResponse = await ApiClient.get('/settings');
      
      if (response.data.success) {
        setSettings({
          newRegistrations: response.data.settings.newRegistrations,
          locationRequired: response.data.settings.locationRequired,
          articleSharing: response.data.settings.articleSharing,
          articleExport: response.data.settings.articleExport,
          registrationLimit: response.data.settings.registrationLimit.toString(),
          articleReadLimit: response.data.settings.articleReadLimit.toString(),
        });
      } else {
        throw new Error(response.data.error || 'Failed to fetch settings');
      }
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      setError(err.response?.data?.error || err.message || 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for toggle switches
  const handleToggle = (key: keyof Settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    // Reset save status when settings change
    setSaveStatus(null);
  };

  // Handler for input changes
  const handleInputChange = (key: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // Reset save status when settings change
    setSaveStatus(null);
  };

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setSaveStatus(null);
      setError(null);

      // Convert string values to numbers
      const settingsToSend = {
        ...settings,
        registrationLimit: parseInt(settings.registrationLimit),
        articleReadLimit: parseInt(settings.articleReadLimit),
      };

      // Use ApiClient to update settings with proper typing
      const response: ApiResponse = await ApiClient.put('/settings', settingsToSend);

      if (response.data.success) {
        setSaveStatus('success');
        // Update local settings with the response from server
        setSettings({
          newRegistrations: response.data.settings.newRegistrations,
          locationRequired: response.data.settings.locationRequired,
          articleSharing: response.data.settings.articleSharing,
          articleExport: response.data.settings.articleExport,
          registrationLimit: response.data.settings.registrationLimit.toString(),
          articleReadLimit: response.data.settings.articleReadLimit.toString(),
        });
      } else {
        throw new Error(response.data.error || 'Failed to save settings');
      }
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setSaveStatus('error');
      setError(err.response?.data?.error || err.message || 'An unknown error occurred');
    } finally {
      setIsSaving(false);
      
      // Clear status message after 3 seconds
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-600 text-sm">Control system-wide behavior and preferences</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button
            onClick={fetchSettings}
            className="mt-2 text-red-700 text-sm underline hover:text-red-800"
          >
            Try again
          </button>
        </div>
      )}

      {saveStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-green-700 text-sm">Settings saved successfully!</p>
          </div>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700 text-sm">Failed to save settings. Please try again.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registration & Access */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-700" />
            <h2 className="text-base font-semibold text-gray-900">Registration & Access</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <label htmlFor="new-registrations" className="text-sm font-medium text-gray-900 block mb-1">
                  New registrations
                </label>
                <p className="text-xs text-gray-500">Allow new users to register to the platform</p>
              </div>
              <Switch
                id="new-registrations"
                checked={settings.newRegistrations}
                onChange={() => handleToggle('newRegistrations')}
                className={`${settings.newRegistrations ? 'bg-black' : 'bg-gray-300'} 
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span
                  className={`${settings.newRegistrations ? 'translate-x-6' : 'translate-x-1'} 
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>

            <hr className="border-gray-200" />

            <div className="flex justify-between items-center">
              <div className="flex-1">
                <label htmlFor="location-required" className="text-sm font-medium text-gray-900 block mb-1">
                  City/Location Required
                </label>
                <p className="text-xs text-gray-500">Require location information during registration</p>
              </div>
              <Switch
                id="location-required"
                checked={settings.locationRequired}
                onChange={() => handleToggle('locationRequired')}
                className={`${settings.locationRequired ? 'bg-black' : 'bg-gray-300'} 
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span
                  className={`${settings.locationRequired ? 'translate-x-6' : 'translate-x-1'} 
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </div>
        </div>

        {/* Article Limitations */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-gray-700" />
            <h2 className="text-base font-semibold text-gray-900">Article Limitations</h2>
          </div>
          <p className="text-sm text-gray-600">Set limits for your platform</p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="registration-limit" className="text-sm font-medium text-gray-900 block mb-1">
                Registration Limit
              </label>
              <input
                id="registration-limit"
                type="number"
                min="0"
                value={settings.registrationLimit}
                onChange={(e) => handleInputChange('registrationLimit', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSaving}
              />
              <p className="text-xs text-gray-500 mt-1">Maximum number of new user registrations allowed</p>
            </div>

            <div>
              <label htmlFor="article-read-limit" className="text-sm font-medium text-gray-900 block mb-1">
                Maximum Article Reads Per User
              </label>
              <input
                id="article-read-limit"
                type="number"
                min="1"
                value={settings.articleReadLimit}
                onChange={(e) => handleInputChange('articleReadLimit', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSaving}
              />
              <p className="text-xs text-gray-500 mt-1">How many times each user can read a single article</p>
            </div>
          </div>
        </div>

        {/* Privacy & Sharing */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-700" />
            <h2 className="text-base font-semibold text-gray-900">Privacy & Sharing</h2>
          </div>
          <p className="text-sm text-gray-600">Configure data sharing and privacy options</p>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <label htmlFor="article-sharing" className="text-sm font-medium text-gray-900 block mb-1">
                  Allow Article Sharing
                </label>
                <p className="text-xs text-gray-500">Users can share article links with others</p>
              </div>
              <Switch
                id="article-sharing"
                checked={settings.articleSharing}
                onChange={() => handleToggle('articleSharing')}
                className={`${settings.articleSharing ? 'bg-black' : 'bg-gray-300'} 
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                disabled={isSaving}
              >
                <span
                  className={`${settings.articleSharing ? 'translate-x-6' : 'translate-x-1'} 
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>

            <hr className="border-gray-200" />

            <div className="flex justify-between items-center">
              <div className="flex-1">
                <label htmlFor="article-export" className="text-sm font-medium text-gray-900 block mb-1">
                  Allow Article Export
                </label>
                <p className="text-xs text-gray-500">Users can export articles to different formats</p>
              </div>
              <Switch
                id="article-export"
                checked={settings.articleExport}
                onChange={() => handleToggle('articleExport')}
                className={`${settings.articleExport ? 'bg-black' : 'bg-gray-300'} 
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                disabled={isSaving}
              >
                <span
                  className={`${settings.articleExport ? 'translate-x-6' : 'translate-x-1'} 
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="col-span-1 md:col-span-2 pt-4">
          <button 
            type="submit"
            disabled={isSaving}
            className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              'Save All Settings'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}