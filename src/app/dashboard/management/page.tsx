import { UserStats } from "@/app/components/UserStats";
import { UserTable } from "@/app/components/UserTable";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Search } from "lucide-react";


export default function UserManagementPage() {
  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-[#000]">Manage readers, contributors, and administrators</p>
      </div>

      <UserStats />

    

      <UserTable />
    </div>
    </ProtectedRoute>
  );
}
