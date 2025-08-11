import {  getArticles, updateArticleAction } from "@/api/article";
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
import { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";

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

export function ArticleTable() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

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

  const handleAction = async (value: string, article: Article) => {
    console.log(`Action '${value}' triggered for article ${article.title}`);
    // TODO: Call backend API to update article status/spotlight if needed
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="text-[#000] border-b">
            <tr>
              <th className="p-2">Article</th>
              <th className="p-2">Author</th>
              <th className="p-2">Category</th>
              <th className="p-2">Status</th>
              <th className="p-2">Published</th>
              <th className="p-2">Performance</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="p-2">
                  <div className="font-bold">{article.title}</div>
                  <div className="text-[10px] text-[#000] font-[400]">
                    {article.meta}
                  </div>
                </td>
                <td className="p-2">{article.authorName || article.authorName}</td>
                <td className="p-2">
                  <span className="bg-[#99999933] text-[#000] font-[400] px-2 py-1 rounded-[6px] text-xs">
                    {article.category}
                  </span>
                </td>
                <td className="p-2">
                  <span className="bg-black text-white px-2 py-1 rounded text-xs">
                    {article.actionTag}
                  </span>
                </td>
                <td className="p-2">{article.date}</td>
                <td className="p-2">{article.views}</td>
               <td className="p-2 text-[#000] flex items-center gap-2">
  <Select
    defaultValue={article.actionTag || "unsuspend"} // Set current action or fallback to "spot"
    onValueChange={async (value) => {
      try {
        await updateArticleAction(article._id, value);
        console.log(`Action "${value}" applied to article ${article._id}`);
        // Optionally trigger a UI update
      } catch (error) {
        console.error("Failed to update article action:", error);
      }
    }}
  >
    <SelectTrigger className="w-[140px]">
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
  <Button onClick={() => handleView(article)}>View</Button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Article Details</DialogTitle>
            <DialogDescription>
              Details about <strong>{selectedArticle?.title}</strong>
            </DialogDescription>
          </DialogHeader>
          {selectedArticle && (
            <div className="space-y-2 text-sm">
              <p><strong>Title:</strong> {selectedArticle.title}</p>
              <p><strong>Meta:</strong> {selectedArticle.meta}</p>
              <p><strong>Author:</strong> {selectedArticle.authorName || selectedArticle.authorName}</p>
              <p><strong>Category:</strong> {selectedArticle.category}</p>
              <p><strong>Status:</strong> {selectedArticle.actionTag}</p>
              <p><strong>Date:</strong> {selectedArticle.date}</p>
              <p><strong>Views:</strong> {selectedArticle.views}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal (simplified) */}
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
              {/* Add more fields as needed */}
              <Button type="button" onClick={() => alert("Update not yet implemented")}>
                Save Changes
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
