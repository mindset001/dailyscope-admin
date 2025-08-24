import { getArticles, updateArticleAction } from "@/api/article";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useEffect, useState, useMemo } from "react";
import { Pencil, Search, Trash, X, ChevronLeft, ChevronRight } from "lucide-react";
import { timeAgo } from "@/utils/timeAgo";

type Article = {
  _id: string;
  title: string;
  meta: string;
  authorName: string;
  author: string;
  category: string;
  status: string;
  createdAt: string;
  views: string;
  actionTag?: string;
};

export function ArticleTable() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const data = await getArticles();
      setArticles(data);
      console.log("Articles fetched successfully:", data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter articles based on search term
  const filteredArticles = useMemo(() => {
    if (!searchTerm.trim()) {
      return articles;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    return articles.filter((article) => {
      const title = (article.title || '').toLowerCase();
      const authorName = (article.authorName || '').toLowerCase();
      const category = (article.category || '').toLowerCase();
      const meta = (article.meta || '').toLowerCase();
      
      return (
        title.includes(searchLower) ||
        authorName.includes(searchLower) ||
        category.includes(searchLower) ||
        meta.includes(searchLower)
      );
    });
  }, [articles, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  const handleView = (article: Article) => {
    setSelectedArticle(article);
    setOpen(true);
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        await fetch(`/api/articles/${id}`, { method: "DELETE" });
        fetchArticles();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };


  const exportToCSV = () => {
    if (filteredArticles.length === 0) return;

    const headers = ["Title", "Author", "Category", "Status", "Date", "Views"];
    const rows = filteredArticles.map((a) => [
      a.title,
      a.authorName || "Unknown",
      a.category,
      a.actionTag || "Active",
      new Date(a.createdAt).toLocaleString(),
      a.views,
    ]);

    const csvContent =
      [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "articles.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div>
      {/* Search Input */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search articles by title, author, category, or description"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-white p-3 pl-10 pr-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute top-3 right-3 h-5 w-5 text-gray-400 hover:text-gray-600"
              title="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* ✅ Export button */}
        {filteredArticles.length > 0 && (
          <Button onClick={exportToCSV} className="bg-black text-white hover:bg-gray-800">
            Export CSV
          </Button>
        )}
      </div>

      <div className="bg-white border rounded-lg p-4">
        {/* Header with results info and items per page selector */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Articles</h3>
            <p className="text-sm text-gray-600">
              {searchTerm ? (
                <>
                  Showing {currentArticles.length} of {filteredArticles.length} articles 
                  {searchTerm && (
                    <span className="ml-1">
                      matching "<span className="font-medium text-blue-600">{searchTerm}</span>"
                    </span>
                  )}
                </>
              ) : (
                `Showing ${currentArticles.length} of ${articles.length} articles`
              )}
            </p>
          </div>

          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading articles...</div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="text-[#000] border-b bg-gray-50">
                  <tr>
                    <th className="p-3 font-medium">Article</th>
                    <th className="p-3 font-medium">Author</th>
                    <th className="p-3 font-medium">Category</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Published</th>
                    {/* <th className="p-3 font-medium">Performance</th> */}
                    <th className="p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentArticles.length > 0 ? (
                    currentArticles.map((article, idx) => (
                      <tr key={article._id} className={`border-b hover:bg-gray-50 transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="p-3">
                          <div className="font-medium text-gray-900">{article.title}</div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {article.meta}
                          </div>
                        </td>
                        <td className="p-3">{article.authorName || 'Unknown Author'}</td>
                        <td className="p-3">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {article.category}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            article.actionTag === 'suspend' 
                              ? 'bg-red-100 text-red-800'
                              : article.actionTag === 'spot' || article.actionTag === 'fspot'
                              ? 'bg-yellow-100 text-yellow-800'
                              : article.actionTag === 'feat'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {article.actionTag === 'spot' 
                              ? 'Spotlight'
                              : article.actionTag === 'fspot'
                              ? 'Featured Spotlight'
                              : article.actionTag === 'feat'
                              ? 'Featured Article'
                              : article.actionTag || 'Active'}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600">{timeAgo(article.createdAt)}</td>
                        {/* <td className="p-3 text-gray-600">{article.views}</td> */}
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Select
                              defaultValue={article.actionTag || "unsuspend"}
                              onValueChange={async (value) => {
                                try {
                                  await updateArticleAction(article._id, value);
                                  console.log(`Action "${value}" applied to article ${article._id}`);
                                  await fetchArticles(); // Refresh the data
                                } catch (error) {
                                  console.error("Failed to update article action:", error);
                                }
                              }}
                            >
                              <SelectTrigger className="w-[120px] text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="suspend">Suspend</SelectItem>
                                <SelectItem value="unsuspend">Unsuspend</SelectItem>
                                <SelectItem value="spot">Spotlight</SelectItem>
                                <SelectItem value="feat">Featured</SelectItem>
                                <SelectItem value="fspot">Featured Spotlight</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleView(article)}
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
                      <td colSpan={7} className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Search className="h-12 w-12 text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                          <p className="text-sm">
                            {searchTerm ? (
                              <>
                                No articles match your search for "<span className="font-medium">{searchTerm}</span>".
                                <br />
                                <button 
                                  onClick={clearSearch}
                                  className="text-blue-600 hover:text-blue-800 underline mt-1"
                                >
                                  Clear search to see all articles
                                </button>
                              </>
                            ) : (
                              "No articles available at the moment."
                            )}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredArticles.length)} of {filteredArticles.length} articles
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Previous button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    ))}
                  </div>

                  {/* Next button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* View Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Article Details</DialogTitle>
              <DialogDescription>
                Details about <strong>{selectedArticle?.title}</strong>
              </DialogDescription>
            </DialogHeader>
            {selectedArticle && (
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-4 items-start gap-4">
                  <span className="font-medium">Title:</span>
                  <span className="col-span-3">{selectedArticle.title}</span>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <span className="font-medium">Description:</span>
                  <span className="col-span-3">{selectedArticle.meta}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Author:</span>
                  <span className="col-span-3">{selectedArticle.authorName || 'Unknown Author'}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Category:</span>
                  <span className="col-span-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {selectedArticle.category}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Status:</span>
                  <span className="col-span-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedArticle.actionTag === 'suspend' 
                        ? 'bg-red-100 text-red-800'
                        : selectedArticle.actionTag === 'spot' || selectedArticle.actionTag === 'fspot'
                        ? 'bg-yellow-100 text-yellow-800'
                        : selectedArticle.actionTag === 'feat'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedArticle.actionTag || 'Active'}
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Date:</span>
                  <span className="col-span-3">{timeAgo(selectedArticle.createdAt)}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Views:</span>
                  <span className="col-span-3">{selectedArticle.views}</span>
                </div>
              </div>
            )}
            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Article</DialogTitle>
            </DialogHeader>
            {selectedArticle && (
              <form className="space-y-4 text-sm">
                <div>
                  <label className="block mb-1 font-medium">Title</label>
                  <input
                    className="w-full border px-3 py-2 rounded"
                    value={selectedArticle.title}
                    onChange={(e) =>
                      setSelectedArticle({ ...selectedArticle, title: e.target.value })
                    }
                  />
                </div>
                <Button type="button" onClick={() => alert("Update not yet implemented")}>
                  Save Changes
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}