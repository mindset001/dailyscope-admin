import { getArticles } from "@/api/article";
import { Ban } from "lucide-react";
import { useEffect, useState } from "react";

// const articles = Array(4).fill({
//   title: "The Resistance of African design",
//   meta: "8 Mins Read . african-design thinking",
//   author: "Chioma Nnadi",
//   category: "Design",
//   status: "Published",
//   date: "15/03/2024",
//   views: "1,267 Views",
// });

type Article = {
  title: string;
  meta: string;
  author: string;
  category: string;
  status: string;
  date: string;
  views: string;
};

export function ArticleTable() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
  const fetchArticles = async () => {
    try {
      const data = await getArticles();
      setArticles(data); // Example
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  fetchArticles();
}, []);

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
                  <div className="text-[10px] text-[#000] font-[400]">{article.meta}</div>
                </td>
                <td className="p-2">{article.author}</td>
                <td className="p-2">
                  <span className="bg-[#99999933] text-[#000] font-[400] px-2 py-1 rounded-[6px] text-xs">
                    {article.category}
                  </span>
                </td>
                <td className="p-2">
                  <span className="bg-black text-white px-2 py-1 rounded text-xs">
                    {article.status}
                  </span>
                </td>
                <td className="p-2">{article.date}</td>
                <td className="p-2">{article.views}</td>
                <td className="p-2 text-[#000] flex items-center gap-2 cursor-pointer">
                  <Ban className="" />
                  <p>Suspend</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
