'use client'

import { getAllUsers, suspendUser, unsuspendUser } from "@/api/article";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { timeAgo } from "@/utils/timeAgo";
import { Ban, CheckCircle2, Search, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  actionTag: string;
  subscription: string;
  status: 'active' | 'suspended';
  updatedAt: string;
  createdAt?: string;
  lastLogin?: string;
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    return users.filter((user) => {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      const email = (user.email || '').toLowerCase();
      const subscription = (user.subscription || '').toLowerCase();
      const status = (user.status || '').toLowerCase();
      const firstName = (user.firstName || '').toLowerCase();
      const lastName = (user.lastName || '').toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        subscription.includes(searchLower) ||
        status.includes(searchLower) ||
        firstName.includes(searchLower) ||
        lastName.includes(searchLower)
      );
    });
  }, [users, searchTerm]);

  const handleStatusChange = async (userId: string, action: 'suspend' | 'unsuspend') => {
    try {
      setLoading(prev => ({ ...prev, [userId]: true }));
      
      if (action === 'suspend') {
        await suspendUser(userId);
        setSuccessMessage("User suspended successfully");
        setUsers(prev => prev.map(u => 
          u._id === userId ? { ...u, status: 'suspended' } : u
        ));
      } else {
        await unsuspendUser(userId);
        setSuccessMessage("User unsuspended successfully");
        setUsers(prev => prev.map(u => 
          u._id === userId ? { ...u, status: 'active' } : u
        ));
      }
      
      setIsSuccessModalOpen(true);
      // Refresh data after 2 seconds
      setTimeout(() => {
        fetchUsers();
      }, 2000);
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast.error(`Failed to ${action} user`);
    } finally {
      setLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <div className="relative mb-10">
        <input
          type="text"
          placeholder="Search users by name, email, role, or status"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full bg-[#FFFFFF] p-3 pl-10 pr-10 outline-none rounded-md focus:outline-none border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
        <Search className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
        
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute top-3 right-3 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            title="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Users</h3>
            <p className="text-sm text-[#000]">
              {searchTerm ? (
                <>
                  Showing {filteredUsers.length} of {users.length} users 
                  {searchTerm && (
                    <span className="ml-1">
                      matching "<span className="font-medium text-blue-600">{searchTerm}</span>"
                    </span>
                  )}
                </>
              ) : (
                `Complete list of platform users (${users.length} total)`
              )}
            </p>
          </div>

          {searchTerm && (
            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
              {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="text-[#000] border-b bg-gray-50">
              <tr>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Subscription</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Last active</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user._id} className={`border-b hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="p-3">
                      <div className="font-medium text-gray-900">
                        {user.firstName || ''} {user.lastName || ''}
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{user.email || 'N/A'}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 capitalize">
                        {user.subscription || 'Active'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        !user.status || user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{timeAgo(user.updatedAt)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Select 
                          value=""
                          onValueChange={(value) => handleStatusChange(user._id, value as 'suspend' | 'unsuspend')}
                          disabled={loading[user._id]}
                        >
                          <SelectTrigger className="w-[120px] text-sm">
                            <SelectValue placeholder="Actions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem 
                              value="suspend" 
                              disabled={user.status === 'suspended'}
                              className={user.status === 'suspended' ? 'opacity-50' : ''}
                            >
                              Suspend
                            </SelectItem>
                            <SelectItem 
                              value="unsuspend" 
                              disabled={user.status === 'active'}
                              className={user.status === 'active' ? 'opacity-50' : ''}
                            >
                              Unsuspend
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewUser(user)}
                          className="text-sm"
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Search className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                      <p className="text-sm">
                        {searchTerm ? (
                          <>
                            No users match your search for "<span className="font-medium">{searchTerm}</span>".
                            <br />
                            <button 
                              onClick={clearSearch}
                              className="text-blue-600 hover:text-blue-800 underline mt-1"
                            >
                              Clear search to see all users
                            </button>
                          </>
                        ) : (
                          "No users available at the moment."
                        )}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredUsers.length > 0 && (
          <div className="mt-4 px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-600 flex justify-between items-center">
            <span>
              Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* View User Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedUser?.firstName} {selectedUser?.lastName}
              </DialogDescription>
            </DialogHeader>

            {selectedUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Full Name:</span>
                  <span className="col-span-3 font-medium">
                    {selectedUser.firstName || ''} {selectedUser.lastName || ''}
                  </span>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="col-span-3">{selectedUser.email || 'N/A'}</span>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Status:</span>
                  <span className={`col-span-3 px-2 py-1 rounded-full text-xs inline-block w-fit ${
                    selectedUser.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.status || 'Unknown'}
                  </span>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Subscription:</span>
                  <span className="col-span-3 capitalize">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {selectedUser.subscription || 'No role assigned'}
                    </span>
                  </span>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Last Active:</span>
                  <span className="col-span-3">
                    {timeAgo(selectedUser.updatedAt)}
                  </span>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Account Created:</span>
                  <span className="col-span-3">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                
                {selectedUser.lastLogin && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-sm font-medium">Last Login:</span>
                    <span className="col-span-3">
                      {timeAgo(selectedUser.lastLogin)}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Modal */}
        <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Success
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600">{successMessage}</p>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={() => setIsSuccessModalOpen(false)}
                className="bg-green-600 hover:bg-green-700"
              >
                Continue
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}