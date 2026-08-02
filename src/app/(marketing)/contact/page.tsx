"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Container } from "@/components/shared/container";

const contactSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.email("Enter a valid email"),
  school: z.string().min(2, "Enter your school name"),
  message: z.string().min(10, "Tell us a bit more — at least 10 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", school: "", message: "" },
  });

  function onSubmit(values: ContactValues) {
    // No backend yet — this page is UI-only until the Supabase backend lands.
    console.log("contact form submission", values);
    toast.success("Message sent. We'll get back to you within a day.");
    form.reset();
  }

  return (
    <Container className="py-20">
      <div className="mx-auto max-w-lg">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">Contact</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Talk to us</h1>
        <p className="mt-4 text-muted-foreground">
          Questions about bringing STEMORA to your school or district? Send us a note.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ms. Priya Menon" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="priya.menon@gmis.sch.id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School</FormLabel>
                  <FormControl>
                    <Input placeholder="GMIS Jakarta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Tell us about your STEM program…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              Send message
            </Button>
          </form>
        </Form>
      </div>
    </Container>
  );
}
