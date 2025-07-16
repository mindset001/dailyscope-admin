import { Ban } from "lucide-react";

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

export function UserTable() {
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
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                    {user.role}
                  </span>
                </td>
                <td className="p-2">
                  <span className="bg-black text-white px-2 py-1 rounded text-xs">
                    {user.status}
                  </span>
                </td>
                <td className="p-2">{user.lastActive}</td>
                <td className="p-2 text-[#000] flex items-center gap-2 cursor-pointer">
                  <Ban className="h-4 w-4" />
                  Suspend
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
