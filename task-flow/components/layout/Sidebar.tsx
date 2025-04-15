"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ListTodo, 
  Settings, 
  Menu, 
  ChevronLeft,
  Star,
  Clock,
  Check,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  const mainNavItems = [
    {
      title: "Tasks",
      href: "/tasks",
      icon: ListTodo,
      description: "Manage your daily tasks",
      color: "text-blue-500"
    }
    // {
    //   title: "Calendar",
    //   href: "/calendar",
    //   icon: Calendar,
    //   description: "View your schedule",
    //   color: "text-indigo-500"
    // },
    // {
    //   title: "Analytics",
    //   href: "/analytics",
    //   icon: BarChart2,
    //   description: "Track your productivity",
    //   color: "text-emerald-500"
    // }
  ];

  const taskFilters = [
    {
      title: "Today",
      href: "/tasks?filter=today",
      icon: Clock,
      color: "text-amber-500"
    },
    {
      title: "Completed",
      href: "/tasks?filter=completed",
      icon: Check,
      color: "text-green-500"
    },
    {
      title: "Priority",
      href: "/tasks?filter=priority",
      icon: AlertCircle,
      color: "text-red-500"
    },
    {
      title: "Favorites",
      href: "/tasks?filter=favorites",
      icon: Star,
      color: "text-yellow-500"
    }
  ];

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const isActive = (href: string) => {
    if (href === "/tasks") {
      return pathname === "/tasks" || pathname.startsWith("/tasks/") && !pathname.includes("?filter=");
    }
    return pathname.includes(href);
  };

  return (
    <div 
      className={cn(
        "h-screen flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
        expanded ? "w-64" : "w-16",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className={cn(
          "font-bold text-xl text-primary transition-opacity duration-300",
          expanded ? "opacity-100" : "opacity-0 hidden"
        )}>
          TaskFlow
        </h1>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleSidebar} 
          className="h-7 w-7 p-0"
        >
          {expanded ? <ChevronLeft size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-4">
          <div className={cn(
            "mb-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
            expanded ? "block" : "hidden"
          )}>
            Main
          </div>
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50",
                  !expanded && "justify-center"
                )}
              >
                <item.icon className={cn("h-5 w-5", item.color)} />
                <span className={cn(
                  "ml-3 transition-opacity duration-300",
                  expanded ? "opacity-100" : "opacity-0 hidden"
                )}>
                  {item.title}
                </span>
              </Link>
            ))}
          </nav>

          {expanded && (
            <div className="mt-6">
              <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Filters
              </div>
              <nav className="space-y-1">
                {taskFilters.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname.includes(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", item.color)} />
                    <span className="ml-3">{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/settings"
          className={cn(
            "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-primary/10 text-primary"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50",
            !expanded && "justify-center"
          )}
        >
          <Settings className="h-5 w-5 text-gray-500" />
          <span className={cn(
            "ml-3 transition-opacity duration-300",
            expanded ? "opacity-100" : "opacity-0 hidden"
          )}>
            Settings
          </span>
        </Link>
      </div>
    </div>
  );
}
