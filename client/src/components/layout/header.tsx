import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}

export default function Header({ title, description, onAction, actionLabel }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          {onAction && actionLabel && (
            <Button onClick={onAction} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>{actionLabel}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
