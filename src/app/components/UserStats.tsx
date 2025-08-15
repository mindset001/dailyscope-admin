'use client';

import { getAllUsers, getArticles } from '@/api/article';
import {
  Users,
  BookMarked,
  ArrowUpRight,
  MapPin,
  Clock,
  Ban
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface User{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  actionTag: string;
  role: string;
  userLastActive: string;
  lastActive: string;
}

type Article = {
  _id: string;
  title: string;
  meta: string;
  authorName: string;
  author: string; // Assuming author is a string, adjust if it's an object
  category: string;
  status: string;
  date: string;
  views: string;
  actionTag?: string; // Optional field for action tag
};

export function UserStats() {
   const [users, setUsers] = useState<User[]>([]);
   const [articles, setArticles] = useState<Article[]>([]);
 
   useEffect(() => {
     fetchUsers();
     fetchArticles();
   }, []);
 
   const fetchUsers = async () => {
     try {
       const data = await getAllUsers();
       setUsers(data.users);
     } catch (error) {
       console.error("Error fetching users:", error);
     }
   };

   const fetchArticles = async () => {
     try {
       const data = await getArticles();
       setArticles(data);
     } catch (error) {
       console.error("Error fetching articles:", error);
     }
   };
 
   // Calculate dynamic stats based on fetched user and article data
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
      user.status === 'suspended' || 
      user.actionTag === 'suspended' || 
      user.role === 'suspended'
    ).length;

     // Filter articles with actionTag of 'spot' or 'fspot' for spotlights
     const spotlightArticles = articles.filter(article => 
       article.actionTag === 'spot' || article.actionTag === 'fspot'
     ).length;

      const suspendedArticles = articles.filter(article => 
       article.actionTag === 'suspend' 
     ).length;
 

     useEffect(() => {
  fetchUsers();
  fetchArticles();
}, [suspendedUsers, suspendedArticles, spotlightArticles]);
     return [
       { 
         title: 'Total users', 
         value: totalUsers.toString(), 
         change: '+12% from last month', 
         icon: Users 
       },
       { 
         title: 'Total spotlights', 
         value: spotlightArticles.toString(), // Now using dynamic data
         change: '+12% from last month', 
         icon: BookMarked 
       },
       { 
         title: 'Total Articles', 
         value: articles.length.toString(), // Convert to string for consistency
         change: '+12% from last month', 
         icon: BookMarked 
       },
       { 
         title: "Suspended users", 
         value: suspendedUsers.toString(), 
         change: '+5% from last week',
         icon: Users  
       },
       { 
         title: "Suspended Articles", 
         value: suspendedArticles.toString(), 
         change: '-2% from last month',
         icon: Ban
       },
     ];
   };
 
   const stats = calculateStats();

  return (
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-black text-white rounded-xl p-4 shadow flex flex-col gap-2">
              <div className="flex justify-between text-sm font-semibold text-white/80">
                <span>{stat.title}</span>
                <stat.icon size={16} />
              </div>
              <h2 className="text-2xl font-bold">{stat.value}</h2>
              {/* {stat.change && (
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <ArrowUpRight size={14} />
                  <span>{stat.change}</span>
                </div>
              )} */}
            </div>
          ))}
        </div>
  );
}