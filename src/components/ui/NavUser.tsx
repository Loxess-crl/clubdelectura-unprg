"use client";

import { Avatar, AvatarFallback } from "@/components/ui/shadcn/Avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/shadcn/sidebar";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { getItemsFromLocalStorage } from "@/hooks/localStorageService";
import { LocalStorageKeys } from "@/data/constants";
import type { User } from "firebase/auth";
import { AvatarImage } from "./shadcn/Avatar";

export function NavUser() {
  const user = getItemsFromLocalStorage<User>(LocalStorageKeys.user);

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[60px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">
                {user.displayName?.substring(0, 1).at(0) || "U"}
              </AvatarFallback>
              <AvatarImage
                src={user.photoURL || undefined}
                alt={user.displayName || "Usuario"}
              />
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.displayName}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </SidebarMenuButton>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
