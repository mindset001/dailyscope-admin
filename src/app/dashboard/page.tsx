'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  BookMarked,
  ArrowUpRight,
  MapPin,
  Clock
} from 'lucide-react';

const stats = [
  { title: 'Total users', value: '12,847', change: '+12% from last month', icon: Users },
  { title: 'Total spotlights', value: '47', change: '+12% from last month', icon: BookMarked },
  { title: 'Published Articles', value: '847', change: '+12% from last month', icon: BookMarked },
  { title: 'Total Articles', value: '127', change: '+12% from last month', icon: BookMarked },
];

const weeklyActivity = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DashboardPage() {
    const { admin, logout } = useAuth();
  return (
  <ProtectedRoute>
      <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard Overview</h1>
      <p className="text-gray-600 mb-6">Create, edit, and manage long-form articles</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-black text-white rounded-xl p-4 shadow flex flex-col gap-2">
            <div className="flex justify-between text-sm font-semibold text-white/80">
              <span>{stat.title}</span>
              <stat.icon size={16} />
            </div>
            <h2 className="text-2xl font-bold">{stat.value}</h2>
            <div className="flex items-center gap-2 text-xs text-white/70">
              <ArrowUpRight size={14} />
              <span>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Weekly Activity */}
        <div className="col-span-2 bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-4">Weekly Activity</h3>
          {weeklyActivity.map((day) => (
            <div key={day} className="flex items-center justify-between mb-2">
              <span>{day}</span>
              <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-black w-[80%] rounded-full" />
              </div>
              <span className="text-sm text-gray-500">24</span>
            </div>
          ))}
        </div>

       <div>
         {/* Top Active Cities */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-4">Top active cities</h3>
          <ol className="list-decimal pl-4 space-y-2 text-gray-800 text-sm">
            <li  className="flex items-center gap-2">New York <span className="ml-auto text-xs text-gray-400"> 252 users</span></li>
          <li  className="flex items-center gap-2">France <span className="ml-auto text-xs text-gray-400"> 392 users</span></li>
            <li  className="flex items-center gap-2">Ghana <span className="ml-auto text-xs text-gray-400"> 327 users</span></li>
          <li  className="flex items-center gap-2">Nigeria <span className="ml-auto text-xs text-gray-400"> 412 users</span></li>
          </ol>
        </div>
        
      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-4">Recent activity</h3>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex flex-col items-start">
           <p className='font-bold text-[18px]'> New user registration</p>
           <p className='text-[12px]'>2 mins ago</p>
          </li>
          <li className="flex flex-col items-start">
           <p className='font-bold text-[18px]'> New user registration</p>
           <p className='text-[12px]'>2 mins ago</p>
          </li>
          <li className="flex flex-col items-start">
           <p className='font-bold text-[18px]'> New user registration</p>
           <p className='text-[12px]'>2 mins ago</p>
          </li>
        </ul>
      </div>
      </div>

       </div>
    </div>
  </ProtectedRoute>
  );
}
