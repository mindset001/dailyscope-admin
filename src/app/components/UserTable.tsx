'use client'

import { getAllUsers } from "@/api/article";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ban } from "lucide-react";
import { useEffect, useState } from "react";

const users = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@gmail.com",
    role: "Reader",
    status: "Active",
    lastActive: "2 hours ago",
  },
   {
    name: "Sarah Johnson",
    email: "sarah.johnson@gmail.com",
    role: "Reader",
    status: "Active",
    lastActive: "2 hours ago",
  },
   {
    name: "Sarah Johnson",
    email: "sarah.johnson@gmail.com",
    role: "Reader",
    status: "Active",
    lastActive: "2 hours ago",
  },
  // ... repeat more users if needed
];

interface User{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  actionTag: string;
  role: string;
  userLastActive: string;
  lastActive: string;
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
      fetchUsers();
    }, []);
  
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="font-semibold mb-2">Users</h3>
      <p className="text-sm text-[#000] mb-4">Complete list of platform users</p>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="text-[#000] border-b">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Last active</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-2">{user.firstName} {user.lastName}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                    {user.role}
                  </span>
                </td>
                <td className="p-2">
                  <span className="bg-black text-white px-2 py-1 rounded text-xs">
                    {user.actionTag}
                  </span>
                </td>
                <td className="p-2">{user.lastActive}</td>
                <td className="p-2 text-[#000] flex items-center gap-2">
                  <Select onValueChange={(value) => console.log("Action:", value)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="suspend">Suspend</SelectItem>
                      <SelectItem value="unsuspend">Unsuspend</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button >View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
