"use client";

import { useRouter } from "next/navigation";
import { LogOut, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { setStoredRole } from "@/lib/mock-session";
import { mockUsers } from "@/lib/mock-data";
import { ALL_ROLES, ROLE_LABELS, dashboardForRole, type UserRole } from "@/config/roles";

/**
 * Stands in for a real session until Supabase Auth lands.
 *
 * The signed-in identity comes from the surface you are on, not from stored
 * state: /school/* is always the School Admin, /student/* is always the
 * Student. Switching persona stores the role and navigates to that role's
 * dashboard, so what the avatar says and what the page shows can never
 * disagree.
 */
export function PersonaSwitcher({ role }: { role: UserRole }) {
  const user = mockUsers[role];
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex items-center gap-2 rounded-full outline-none ring-primary focus-visible:ring-2" aria-label={`Signed in as ${user.name}`}>
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                {user.avatarInitials}
              </AvatarFallback>
            </Avatar>
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
            <span className="mt-1 font-mono text-[0.65rem] uppercase tracking-wider text-primary">
              {ROLE_LABELS[role]}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
            Preview as
          </DropdownMenuLabel>
          {ALL_ROLES.map((r) => (
            <DropdownMenuItem
              key={r}
              onClick={() => {
                setStoredRole(r);
                router.push(dashboardForRole(r));
              }}
              className="flex items-center justify-between"
            >
              {ROLE_LABELS[r]}
              {r === role ? <Check className="size-3.5 text-primary" /> : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/login")} variant="destructive">
          <LogOut className="size-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
