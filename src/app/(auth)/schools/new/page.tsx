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
import { setStoredRole } from "@/lib/mock-session";
import { dashboardForRole } from "@/config/roles";

const schoolSchema = z.object({
  schoolName: z.string().min(2, "Enter your school's name"),
  adminName: z.string().min(2, "Enter your full name"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});

type SchoolValues = z.infer<typeof schoolSchema>;

export default function NewSchoolPage() {
  const router = useRouter();
  const form = useForm<SchoolValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: { schoolName: "", adminName: "", email: "", password: "" },
  });

  function onSubmit() {
    // Creates schools + users + school_members(role=school_admin) once the
    // backend lands — see docs/architecture/authentication.md#signup-is-never-open.
    setStoredRole("school_admin");
    router.push(dashboardForRole("school_admin"));
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Start your school</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Create your school&apos;s secure workspace. You&apos;ll be the school admin.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <FormField
            control={form.control}
            name="schoolName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School name</FormLabel>
                <FormControl>
                  <Input placeholder="Riverside High School" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="adminName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your full name</FormLabel>
                <FormControl>
                  <Input placeholder="Dr. Lena Ortiz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="lena.ortiz@riverside.edu" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            Create workspace
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have a workspace?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
