import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = "neutral",
  subtitle 
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getIconColor = () => {
    if (title.includes("Jobs")) return "text-blue-600 bg-blue-100";
    if (title.includes("Candidates")) return "text-green-600 bg-green-100";
    if (title.includes("Interviews")) return "text-orange-600 bg-orange-100";
    if (title.includes("Offers")) return "text-purple-600 bg-purple-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconColor()}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {(change || subtitle) && (
        <div className="mt-4 flex items-center text-sm">
          {change && (
            <span className={`font-medium ${getChangeColor()}`}>{change}</span>
          )}
          {subtitle && (
            <span className="text-gray-600 ml-2">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
