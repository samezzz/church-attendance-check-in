"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserProfileDropdown } from "./user-profile-dropdown";

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {}

export function MainNav({ className, ...props }: MainNavProps) {
  const pathname = usePathname();

  const items = [
    {
      title: "Check In",
      href: "/checkin",
    },
    {
      title: "Events",
      href: "/events",
    },
    {
      title: "History",
      href: "/history",
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "text-foreground"
              : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
      <div className="ml-4">
        <UserProfileDropdown />
      </div>
    </nav>
  );
} 