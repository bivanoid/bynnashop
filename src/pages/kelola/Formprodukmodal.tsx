import { useEffect, useState } from "react";
import s from "./kelolaProduk.module.css";
import { getGambarUrl } from "../../hooks/useProduk";
import type { Produk, ProdukForm } from "../../hooks/useProduk";
import { CheckIcon, X } from "@phosphor-icons/react";
import CloudLayout from "../../components/commonts/CloudLayout";
import { useAlert } from "../../context/AlertContext";

interface Props {
  mode: "tambah" | "edit";
  initialData?: Produk | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (form: ProdukForm) => Promise<void> | void;
}

export default function FormProdukModal({
  mode,
  initialData,
  saving,
  onClose,
  onSubmit,
}: Props) {
  const [isOpen, setIsOpen] = useState(false); 
  const [namaBarang, setNamaBarang] = useState("");
  const [deskripsiBarang, setDeskripsiBarang] = useState("");
  const [hargaBarang, setHargaBarang] = useState<string>("");
  const [diskonBarang, setDiskonBarang] = useState<string>("0");
  const [stokBarang, setStokBarang] = useState<string>("0");
  const [gambar, setGambar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { showAlert } = useAlert();
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  function handleClose() {
    setIsOpen(false);
    setTimeout(() => onClose(), 500); 
  }

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setNamaBarang(initialData.nama_barang);
      setDeskripsiBarang(initialData.deskripsi_barang ?? "");
      setHargaBarang(String(initialData.harga_barang));
      setDiskonBarang(String(initialData.diskon_barang ?? 0));
      setStokBarang(String(initialData.stok_barang ?? 0));
      setPreview(getGambarUrl(initialData.gambar));
    }
  }, [mode, initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setGambar(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const harga = Number(hargaBarang) || 0;
  const diskon = Number(diskonBarang) || 0;
  const hargaSetelahDiskon = Math.max(0, harga - (harga * diskon) / 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!namaBarang.trim() || !hargaBarang) {
      setFormError("Nama barang dan harga wajib diisi");
      return;
    }
    if (mode === "tambah" && !gambar) {
      setFormError("Gambar produk wajib diunggah");
      return;
    }
    if (diskon < 0 || diskon > 100) {
      setFormError("Diskon harus di antara 0 - 100%");
      return;
    }
    if (Number(stokBarang) < 0) {
      setFormError("Stok tidak boleh negatif");
      return;
    }

    await onSubmit({
      nama_barang: namaBarang.trim(),
      deskripsi_barang: deskripsiBarang.trim(),
      harga_barang: hargaBarang,
      diskon_barang: diskonBarang || 0,
      stok_barang: stokBarang || 0,
      gambar,
    });

    showAlert((<CheckIcon size={24} weight="duotone"/>), `${namaBarang} Berhasil ditambahkan`);
  };

  return (
    <div
      className={`${s.overlay} ${isOpen ? s.overlayOpen : ""}`}
      onClick={handleClose}
    >
      <div className={`${s.modalBox} ${isOpen ? s.open_modalBox : ""}`} onClick={(e) => e.stopPropagation()}>
        <CloudLayout/>
        <div className={s.modalHeader}>
          <h1>{mode === "tambah" ? "Tambah Produk" : "Edit Produk"}</h1>
          <button
            type="button"
            className={s.closeBtn}
            onClick={handleClose}
            aria-label="Tutup"
          >
            <X size={24} weight="duotone"/>
          </button>
        </div>

        <form className={s.form} onSubmit={handleSubmit}>
          {preview && (
            <div className={s.previewWrap}>
              <img className={s.preview} src={preview} alt="Pratinjau produk" />
            </div>
          )}
          <label className={s.label}>
            Gambar Produk
            <input
              className={s.inputFile}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          <label className={s.label}>
            Nama Barang
            <input
              className={s.input}
              type="text"
              value={namaBarang}
              onChange={(e) => setNamaBarang(e.target.value)}
              placeholder="Contoh: Burger Beef Deluxe"
            />
          </label>

          <label className={s.label}>
            Deskripsi Barang
            <textarea
              className={s.textarea}
              value={deskripsiBarang}
              onChange={(e) => setDeskripsiBarang(e.target.value)}
              placeholder="Deskripsi singkat produk (opsional)"
              rows={3}
            />
          </label>

          <div className={s.row}>
            <label className={s.label}>
              Harga (Rp)
              <input
                className={s.input}
                type="number"
                min={0}
                value={hargaBarang}
                onChange={(e) => setHargaBarang(e.target.value)}
                placeholder="Contoh: 25000"
              />
            </label>

            <label className={s.label}>
              Diskon (%)
              <input
                className={s.input}
                type="number"
                min={0}
                max={100}
                value={diskonBarang}
                onChange={(e) => setDiskonBarang(e.target.value)}
                placeholder="0"
              />
            </label>
          </div>

          <label className={s.label}>
            Stok Barang
            <input
              className={s.input}
              type="number"
              min={0}
              value={stokBarang}
              onChange={(e) => setStokBarang(e.target.value)}
              placeholder="Contoh: 10"
            />
          </label>

          {harga > 0 && diskon > 0 && (
            <p className={s.hintText}>
              Harga setelah diskon: Rp{hargaSetelahDiskon.toLocaleString("id-ID")}
            </p>
          )}

          

          {formError && <p className={s.formError}>{formError}</p>}

          <div className={s.modalActions}>
            <button
              type="button"
              className={s.btnSecondary}
              onClick={handleClose}
              disabled={saving}
            >
              Batal
            </button>
            <button type="submit" className={s.btnPrimary} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}