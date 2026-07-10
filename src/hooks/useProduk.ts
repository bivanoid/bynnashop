import { useCallback, useEffect, useState } from "react";

// Sesuaikan dengan lokasi backend kamu
const API_BASE = import.meta.env.VITE_API;
// misal di file util, atau di atas useProduk.ts
const API_ROOT = API_BASE.replace(/\/api\/?$/, ""); // buang "/api" di ujung
export const getGambarUrl = (gambar: string) => `${API_ROOT}/uploads/${gambar}`;

export interface Produk {
  id: number;
  nama_barang: string;
  deskripsi_barang: string | null;
  harga_barang: number;
  diskon_barang: number;
  stok_barang: number;
  total_diskon: number;
  gambar: string;
}

export type ProdukForm = {
  nama_barang: string;
  deskripsi_barang: string;
  harga_barang: number | string;
  diskon_barang: number | string;
  stok_barang: number | string;
  gambar?: File | null; // file baru (opsional saat edit)
};

// Helper: apapun yang dilempar (Error, string, objek, dll) selalu
// dikonversi jadi string, biar aman di-render di JSX.
function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Terjadi kesalahan";
  }
}

export default function useProduk() {
  const [data, setData] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // status khusus untuk aksi tambah/edit/hapus (biar bisa munculin spinner di modal)
  const [saving, setSaving] = useState(false);

  const fetchProduk = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/getProduk.php`);
      if (!res.ok) throw new Error("Gagal mengambil data produk");
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProduk();
  }, [fetchProduk]);

  const buildFormData = (form: ProdukForm, id?: number) => {
    const fd = new FormData();
    if (id) fd.append("id", String(id));
    fd.append("nama_barang", form.nama_barang);
    fd.append("deskripsi_barang", form.deskripsi_barang ?? "");
    fd.append("harga_barang", String(form.harga_barang));
    fd.append("diskon_barang", String(form.diskon_barang || 0));
    fd.append("stok_barang", String(form.stok_barang || 0));
    if (form.gambar) fd.append("gambar", form.gambar);
    return fd;
  };

  const tambahProduk = async (form: ProdukForm) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/tambahProduk.php`, {
        method: "POST",
        body: buildFormData(form),
      });
      const result = await res.json();
      if (!res.ok || result?.status === "error") {
        throw new Error(result?.message ?? "Gagal menambah produk");
      }
      await fetchProduk();
      return true;
    } finally {
      setSaving(false);
    }
  };

  const editProduk = async (id: number, form: ProdukForm) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/updateProduk.php`, {
        method: "POST",
        body: buildFormData(form, id),
      });
      const result = await res.json();
      if (!res.ok || result?.status === "error") {
        throw new Error(result?.message ?? "Gagal mengubah produk");
      }
      await fetchProduk();
      return true;
    } finally {
      setSaving(false);
    }
  };

  const hapusProduk = async (id: number) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/hapusProduk.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (!res.ok || result?.status === "error") {
        throw new Error(result?.message ?? "Gagal menghapus produk");
      }
      await fetchProduk();
      return true;
    } finally {
      setSaving(false);
    }
  };

  return {
    data,
    loading,
    error,
    saving,
    fetchProduk,
    tambahProduk,
    editProduk,
    hapusProduk,
  };
}