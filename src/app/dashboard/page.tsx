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
  dates: string[];
};

export default function DashboardPage() {
  const { admin, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);
  const [topCities, setTopCities] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [activityRes, citiesRes] = await Promise.all([
          ApiClient.get('/stats/weekly-activity'),
          ApiClient.get('/stats/top-cities')
        ]);

        setWeeklyActivity(activityRes.data.data);
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

  const calculateStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => {
      if (!user.lastActive && !user.userLastActive) return false;
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
        value: '47',
        change: '+12% from last month',
        icon: BookMarked
      },
      {
        title: 'Total Articles',
        value: '127',
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

  // Safe date formatting function
  const formatDateSafely = (dateString: string) => {
    if (!isClient) return ''; // Return empty string during SSR
    try {
      return new Date(dateString).toDateString();
    } catch {
      return 'Invalid Date';
    }
  };

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
              weeklyActivity.map((day: WeeklyActivity, idx: number) => (
                <div key={idx} className="flex items-center justify-between mb-2">
                  <span>Day {day._id.day}</span>
                  <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black rounded-full" 
                      style={{ width: `${Math.min(day.count / 10 * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">{day.count}</span>
                </div>
              ))
            )}
          </div>

          <div>
            {/* Top Active Cities */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
              <h3 className="font-semibold mb-4">Top active cities</h3>
              {topCities.length === 0 ? (
                <p className="text-gray-400 text-sm">Loading cities…</p>
              ) : (
                <ol className="list-decimal pl-4 space-y-2 text-gray-800 text-sm">
                  {topCities.slice(0, 4).map((city: any, index: number) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{city.city}</span>
                      <span className="text-xs text-gray-400">{city.count} users</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Recent activity</h3>
              {weeklyActivity.length === 0 ? (
                <p className="text-gray-400 text-sm">Loading activity…</p>
              ) : (
                <ul className="space-y-3 text-sm text-gray-700">
                  {weeklyActivity.slice(-3).map((day: WeeklyActivity, index: number) => {
                    const latestDate = day.dates && day.dates.length > 0 
                      ? day.dates[day.dates.length - 1] 
                      : null;
                    
                    return (
                      <li key={index} className="flex flex-col items-start">
                        <p className="font-bold text-[18px]">
                          {day.count} new user{day.count !== 1 ? 's' : ''} registered
                        </p>
                        {latestDate && (
                          <p className="text-[12px]">
                            on {formatDateSafely(latestDate)}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}