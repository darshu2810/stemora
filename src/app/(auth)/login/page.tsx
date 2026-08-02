"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setStoredRole } from "@/lib/mock-session";
import { ROLE_LABELS, PREVIEW_ROLES, dashboardForRole, type UserRole } from "@/config/roles";

const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  previewRole: z.custom<UserRole>(),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", previewRole: "school_admin" },
  });

  function onSubmit(values: LoginValues) {
    // Supabase Auth isn't wired up yet — see docs/architecture/authentication.md.
    // Until then, sign-in just picks which dashboard shell to preview.
    setStoredRole(values.previewRole);
    router.push(dashboardForRole(values.previewRole));
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Log in</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Welcome back to your school&apos;s workspace.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" placeholder="you@school.edu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" autoComplete="current-password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-lg border border-dashed border-border bg-secondary/40 p-4">
            <FormField
              control={form.control}
              name="previewRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">
                    Preview mode — continue as
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PREVIEW_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    No backend is connected yet — this picks which dashboard you land on.
                  </p>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            Log in
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to STEMORA?{" "}
        <Link href="/schools/new" className="font-medium text-primary hover:underline">
          Start your school
        </Link>
      </p>
    </div>
  );
}
