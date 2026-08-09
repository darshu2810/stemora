import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Hands out a short-lived signed URL for a stored resource.
 *
 * The bucket is private, so this is the only way to read one. Authorisation is
 * not decided here: the `resources` row is fetched through the caller's own
 * RLS-scoped client, so a resource belonging to another school simply does not
 * come back, and the storage policy checks school membership a second time
 * when the signature is issued.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: resource } = await supabase
    .from("resources")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  if (!resource?.storage_path) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const { data: signed, error } = await supabase.storage
    .from("resources")
    .createSignedUrl(resource.storage_path, 60);

  if (error || !signed) {
    return NextResponse.json({ error: "Could not open that file." }, { status: 403 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
