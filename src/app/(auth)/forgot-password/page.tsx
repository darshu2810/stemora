"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, MailCheck } from "lucide-react";
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

const forgotSchema = z.object({ email: z.email("Enter a valid email") });
type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = React.useState(false);
  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  function onSubmit() {
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="size-5" />
        </div>
        <h1 className="mt-4 font-display text-xl font-semibold">Check your email</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          If an account exists for {form.getValues("email")}, we&apos;ve sent a reset link.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          render={
            <Link href="/login">
              <ArrowLeft className="size-4" /> Back to log in
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Reset your password</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Enter your email and we&apos;ll send you a reset link.
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
                  <Input type="email" placeholder="you@gmis.sch.id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            Send reset link
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 inline size-3.5" /> Back to log in
        </Link>
      </p>
    </div>
  );
}
