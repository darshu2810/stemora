"use client";

import { LogOut } from "lucide-react";
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
import { signOut } from "@/app/(auth)/actions";
import { ROLE_LABELS, type UserRole } from "@/config/roles";

/** The signed-in user, and the way out. No persona switching — this is a real session. */
export function UserMenu({
  name,
  email,
  role,
  initials,
}: {
  name: string;
  email: string;
  role: UserRole;
  initials: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className="flex items-center gap-2 rounded-full outline-none ring-primary focus-visible:ring-2"
            aria-label={`Signed in as ${name}`}
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <span className="text-sm font-medium">{name}</span>
            <span className="text-xs font-normal text-muted-foreground">{email}</span>
            <span className="mt-1 font-mono text-[0.65rem] uppercase tracking-wider text-primary">
              {ROLE_LABELS[role]}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={signOut}>
          <DropdownMenuItem
            variant="destructive"
            render={
              <button type="submit" className="w-full">
                <LogOut className="size-4" /> Log out
              </button>
            }
          />
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
