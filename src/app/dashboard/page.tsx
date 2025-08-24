'use client';

import { getAllUsers } from '@/api/article';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  BookMarked,
  ArrowUpRight,
  MapPin,
  Clock,
  Ban
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { UserStats } from '../components/UserStats';
import ApiClient from '@/utils/api';



interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  actionTag: string;
  role: string;
  userLastActive: string;
  lastActive: string;
}
type WeeklyActivity = {
  _id: {
    year: number;
    month: number;
    day: number;
  };
  count: number;
  dates: [];
};

export default function DashboardPage() {
  const { admin, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);
  const [topCities, setTopCities] = useState([]);



  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [activityRes, citiesRes] = await Promise.all([
          ApiClient.get('/stats/weekly-activity'),
          ApiClient.get('/stats/top-cities')
        ]);

        setWeeklyActivity(activityRes.data.data);
        console.log('activityRes', activityRes.data.data)
        setTopCities(citiesRes.data.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);



  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Calculate dynamic stats based on fetched user data
  const calculateStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => {
      // Assuming a user is active if they were active within the last 7 days
      const lastActiveDate = new Date(user.lastActive || user.userLastActive);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return lastActiveDate >= sevenDaysAgo;
    }).length;

    const suspendedUsers = users.filter(user =>
      user.actionTag === 'suspended' || user.role === 'suspended'
    ).length;

    return [
      {
        title: 'Total users',
        value: totalUsers.toString(),
        change: '+12% from last month',
        icon: Users
      },
      {
        title: 'Total spotlights',
        value: '47', // Keep static for now, replace with actual data when available
        change: '+12% from last month',
        icon: BookMarked
      },
      {
        title: 'Total Articles',
        value: '127', // Keep static for now, replace with actual data when available
        change: '+12% from last month',
        icon: BookMarked
      },
      {
        title: "Active users",
        value: activeUsers.toString(),
        change: '+5% from last week',
        icon: Users
      },
      {
        title: "Suspended",
        value: suspendedUsers.toString(),
        change: '-2% from last month',
        icon: Ban
      },
    ];
  };

  const stats = calculateStats();

  return (
    <ProtectedRoute>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard Overview</h1>
        <p className="text-gray-600 mb-6">Create, edit, and manage long-form articles</p>

        {/* Stat Cards */}
        <UserStats />

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Weekly Activity */}
          <div className="col-span-2 bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-4">Weekly Activity</h3>
            {weeklyActivity.length === 0 ? (
              <p className="text-gray-400 text-sm">Loading activity…</p>
            ) : (
              weeklyActivity.map((day: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between mb-2">
                  <span>Day {day._id}</span>
                  <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-black w-[80%] rounded-full" />
                  </div>
                  <span className="text-sm text-gray-500">{day.count}</span>
                </div>
              ))
            )}
          </div>


          <div>
            {/* Top Active Cities */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Top active cities</h3>
              <ol className="list-decimal pl-4 space-y-2 text-gray-800 text-sm">
                <li className="flex items-center gap-2">New York <span className="ml-auto text-xs text-gray-400"> 252 users</span></li>
                <li className="flex items-center gap-2">France <span className="ml-auto text-xs text-gray-400"> 392 users</span></li>
                <li className="flex items-center gap-2">Ghana <span className="ml-auto text-xs text-gray-400"> 327 users</span></li>
                <li className="flex items-center gap-2">Nigeria <span className="ml-auto text-xs text-gray-400"> 412 users</span></li>
              </ol>
            </div>

            {/* Recent Activity */}


            <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Recent activity</h3>

          {weeklyActivity.length === 0 ? (
  <p className="text-gray-400 text-sm">Loading activity…</p>
) : (
  (() => {
    const latestDay = weeklyActivity[weeklyActivity.length - 1];
    const latestDate = new Date(latestDay.dates[latestDay.dates.length - 1]);

    return (
      <ul className="space-y-3 text-sm text-gray-700">
        <li className="flex flex-col items-start">
          <p className="font-bold text-[18px]">
            New user registrations on {latestDate.toDateString()}
          </p>
          <p className="text-[12px]">
            {latestDay.count} accounts created recently
          </p>
        </li>
      </ul>
    );
  })()
)}



            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}