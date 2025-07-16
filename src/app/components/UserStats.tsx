import { Users, Ban } from "lucide-react";

export function UserStats() {
  const stats = [
    { title: "Total users", value: "12,847", icon: <Users className="w-4 h-4" /> },
    { title: "Active users", value: "47", icon: <Users className="w-4 h-4" /> },
    { title: "Contributors", value: "847", icon: <Users className="w-4 h-4" /> },
    { title: "Suspended", value: "127", icon: <Ban className="w-4 h-4" /> },
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
            {item.icon}
          </div>
          <div className="text-2xl font-semibold">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
