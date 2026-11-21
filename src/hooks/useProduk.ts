import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET_KEY as string;

export interface Produk {
  id: number;
  nama_barang: string;
  deskripsi_barang: string | null;
  gambar: string | null;
  harga_barang: number;
  diskon_barang: number;
  stok_barang: number;
  total_diskon: number;
}

export interface ProdukForm {
  nama_barang: string;
  deskripsi_barang: string;
  harga_barang: string | number;
  diskon_barang: string | number;
  stok_barang: string | number;
  gambar: File | null;
}

export function getGambarUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function uploadGambar(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "webp";
  const fileName = `produk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw new Error(`Gagal mengunggah gambar: ${error.message}`);
  return fileName;
}

async function hapusGambar(path: string | null | undefined) {
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

function hitungTotalDiskon(harga: number, diskon: number) {
  return Math.max(0, Math.round(harga - (harga * diskon) / 100));
}

export default function useProduk() {
  const [data, setData] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: rows, error } = await supabase
      .from("items")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setData((rows ?? []) as Produk[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tambahProduk = async (form: ProdukForm) => {
    setSaving(true);
    try {
      const harga = Number(form.harga_barang) || 0;
      const diskon = Number(form.diskon_barang) || 0;
      const stok = Number(form.stok_barang) || 0;

      let gambarPath: string | null = null;
      if (form.gambar) {
        gambarPath = await uploadGambar(form.gambar);
      }

      const { data: inserted, error } = await supabase
        .from("items")
        .insert({
          nama_barang: form.nama_barang,
          deskripsi_barang: form.deskripsi_barang || null,
          gambar: gambarPath,
          harga_barang: harga,
          diskon_barang: diskon,
          stok_barang: stok,
          total_diskon: hitungTotalDiskon(harga, diskon),
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      setData((prev) => [inserted as Produk, ...prev]);
    } finally {
      setSaving(false);
    }
  };

  const editProduk = async (id: number, form: ProdukForm) => {
    setSaving(true);
    try {
      const harga = Number(form.harga_barang) || 0;
      const diskon = Number(form.diskon_barang) || 0;
      const stok = Number(form.stok_barang) || 0;

      const existing = data.find((item) => item.id === id);
      let gambarPath = existing?.gambar ?? null;

      if (form.gambar) {
        gambarPath = await uploadGambar(form.gambar);
        if (existing?.gambar) {
          await hapusGambar(existing.gambar);
        }
      }

      const { data: updated, error } = await supabase
        .from("items")
        .update({
          nama_barang: form.nama_barang,
          deskripsi_barang: form.deskripsi_barang || null,
          gambar: gambarPath,
          harga_barang: harga,
          diskon_barang: diskon,
          stok_barang: stok,
          total_diskon: hitungTotalDiskon(harga, diskon),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);

      setData((prev) =>
        prev.map((item) => (item.id === id ? (updated as Produk) : item)),
      );
    } finally {
      setSaving(false);
    }
  };

  const hapusProduk = async (id: number) => {
    const existing = data.find((item) => item.id === id);

    const { error } = await supabase.from("items").delete().eq("id", id);
    if (error) throw new Error(error.message);

    if (existing?.gambar) {
      await hapusGambar(existing.gambar);
    }

    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return { data, loading, error, saving, tambahProduk, editProduk, hapusProduk };
}