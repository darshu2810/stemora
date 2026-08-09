import { redirect } from "next/navigation";

/**
 * Registering a school is now one section of the register page, alongside the
 * student one. This path is kept because it is what earlier emails, links, and
 * bookmarks point at.
 */
export default function NewSchoolPage() {
  redirect("/register?as=school");
}
