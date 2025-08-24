'use client';

import ApiClient from '@/utils/api';
import { useEffect, useState } from 'react';

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await ApiClient.get('/newsletter/subscribers');
        setSubscribers(res.data.data);
        console.log('subscribers', res.data.data)
      } catch (error) {
        console.error('Failed to fetch subscribers:', error);
      }
    };
    fetchSubscribers();
  }, []);

  // Convert to CSV and trigger download
  const exportToCSV = () => {
    if (subscribers.length === 0) return;

    // Define CSV headers
    const headers = ['S/N', 'Email', 'Date Subscribed'];

    // Map subscribers into rows
    const rows = subscribers.map((sub, index) => [
      index + 1,
      sub.email,
      new Date(sub.subscribedAt).toLocaleString()
    ]);

    // Combine headers + rows
    const csvContent =
      [headers, ...rows]
        .map((row) => row.join(','))
        .join('\n');

    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Subscribers</h1>
        {subscribers.length > 0 && (
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Export CSV
          </button>
        )}
      </div>

      {subscribers.length === 0 ? (
        <p className="text-gray-400">No subscribers yet.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-700 rounded-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-900 text-left">
                <th className="p-3 border-b border-gray-700 text-white">#</th>
                <th className="p-3 border-b border-gray-700 text-white">Email</th>
                <th className="p-3 border-b border-gray-700 text-white">Date Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub: any, index: number) => (
                <tr key={sub._id} className="hover:bg-gray-800">
                  <td className="p-3 border-b border-gray-700">{index + 1}</td>
                  <td className="p-3 border-b border-gray-700">{sub.email}</td>
                  <td className="p-3 border-b border-gray-700">
                    {new Date(sub.subscribedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
