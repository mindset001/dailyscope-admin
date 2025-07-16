import { UserStats } from "@/app/components/UserStats";
import { UserTable } from "@/app/components/UserTable";
import { Search } from "lucide-react";


export default function UserManagementPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-[#000]">Manage readers, contributors, and administrators</p>
      </div>

      <UserStats />

     <div className="relative">
        <input
          type="text"
          placeholder="Search for articles by title or author"
          className="w-full bg-[#FFFFFF] p-3 pl-10 outline-none rounded-md focus:outline-none"
        />
        <Search className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
      </div>

      <UserTable />
    </div>
  );
}
