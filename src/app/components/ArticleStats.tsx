import { BookOpen } from "lucide-react";

export function ArticleStats() {
  const stats = [
    { title: "Published", value: "12,847" },
    { title: "Drafts", value: "47" },
    { title: "In review", value: "847" },
    { title: "Total views", value: "127" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-black text-white p-4 rounded-lg shadow flex flex-col gap-2"
        >
          <div className="flex justify-between text-sm text-gray-300">
            <span>{item.title}</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-2xl font-semibold">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
