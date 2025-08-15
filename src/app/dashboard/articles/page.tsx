'use client';

import { ArticleStats } from "@/app/components/ArticleStats";
import { ArticleTable } from "@/app/components/Articletable";
import { UserStats } from "@/app/components/UserStats";
import CreateArticleModal from "@/app/modals/CreateArticle";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { useState } from "react";


export default function ArticleManagementPage() {
   const [isOpen, setIsOpen] = useState(false);
  return (
   <ProtectedRoute>
     <div className="p-6 space-y-6" >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Article Management</h1>
          <p className="text-[#000]">Create, edit, and manage long-form articles</p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="cursor-pointer bg-black text-white flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-900">
          <Plus className="h-4 w-4" />
          Create new article
        </Button>
      </div>
 <CreateArticleModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <UserStats />

     

      <ArticleTable />
    </div>
   </ProtectedRoute>
  );
}
