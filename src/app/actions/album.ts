"use server";

import { revalidatePath } from "next/cache";
import { getGuestByToken } from "@/lib/guests";
import { isDemoMode } from "@/lib/utils";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "album";

export type UploadState =
  | { ok: true; count: number }
  | { ok: false; error: string }
  | null;

export async function uploadAlbumPhotos(
  _prev: UploadState,
  formData: FormData
): Promise<UploadState> {
  const token = String(formData.get("token") ?? "");
  const guest = await getGuestByToken(token);
  if (!guest) return { ok: false, error: "Invitación no válida." };

  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return { ok: false, error: "Selecciona al menos una foto." };

  if (isDemoMode()) {
    return {
      ok: false,
      error: "El álbum se activa con Supabase conectado (ver README).",
    };
  }

  const supabase = createSupabaseAdmin();
  let count = 0;
  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${token}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (!error) count++;
  }

  revalidatePath(`/album/${token}`);
  return { ok: true, count };
}

export async function listAlbumPhotos(token: string): Promise<string[]> {
  if (isDemoMode()) return [];
  const supabase = createSupabaseAdmin();
  const { data } = await supabase.storage.from(BUCKET).list(token, {
    sortBy: { column: "created_at", order: "desc" },
    limit: 200,
  });
  if (!data) return [];
  return data.map(
    (f) =>
      supabase.storage.from(BUCKET).getPublicUrl(`${token}/${f.name}`).data.publicUrl
  );
}
