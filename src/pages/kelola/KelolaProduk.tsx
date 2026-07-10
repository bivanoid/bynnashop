import { useState } from "react";
import s from "./kelolaProduk.module.css";
import useProduk, { type Produk, type ProdukForm } from "../../hooks/useProduk";
import FormProdukModal from "./Formprodukmodal";
import Nav from "../../components/layouts/Nav";
import CloudLayout from "../../components/commonts/CloudLayout";
import { ArrowLeftIcon, Plus } from "@phosphor-icons/react";
import AnimatedContent from "../../animation/AnimatedContent";

export default function KelolaProduk() {
  const API_BASE = import.meta.env.VITE_API;
  const BACKEND_ROOT = API_BASE.replace(/\/api\/?$/, "");
  const { data, loading, error, saving, tambahProduk, editProduk, hapusProduk } =
    useProduk();

  const [modalMode, setModalMode] = useState<"tambah" | "edit" | null>(null);
  const [selectedItem, setSelectedItem] = useState<Produk | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const openTambah = () => {
    setSelectedItem(null);
    setActionError(null);
    setModalMode("tambah");
    console.log("VITE_API:", import.meta.env.VITE_API);
  };

  const openEdit = (item: Produk) => {
    setSelectedItem(item);
    setActionError(null);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedItem(null);
  };

  const handleSubmit = async (form: ProdukForm) => {
    try {
      if (modalMode === "tambah") {
        await tambahProduk(form);
      } else if (modalMode === "edit" && selectedItem) {
        await editProduk(selectedItem.id, form);
      }
      closeModal();
    } catch (err: any) {
      setActionError(err.message ?? "Terjadi kesalahan saat menyimpan");
    }
  };

  const handleHapus = async (item: Produk) => {
    const konfirmasi = window.confirm(
      `Hapus produk "${item.nama_barang}"? Tindakan ini tidak bisa dibatalkan.`,
    );
    if (!konfirmasi) return;

    setDeletingId(item.id);
    try {
      await hapusProduk(item.id);
    } catch (err: any) {
      alert(err.message ?? "Gagal menghapus produk");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Nav
        left={<ArrowLeftIcon size={24} weight="duotone"/>}
        leftAct="/keranjang"
        title="Bynna's Admin"
        right={""}
        rightAct=""
      />
      <AnimatedContent>
        <div className={s.kelola}>
          <CloudLayout />
          <div className={s.headerRow}>
            <div>
              <h1 className={s.title}>Kelola Produk</h1>
              <p className={s.subtitle}>Tambah, ubah, atau hapus produk katalog kamu</p>
            </div>
            <button className={s.btnPrimary} onClick={openTambah}>
                <Plus size={16} weight="duotone"/> Tambah Produk
            </button>
          </div>
  
          {loading && <p className={s.info}>Memuat data...</p>}
          {error && (
            <p className={s.formError}>
              {typeof error === "string" ? error : "Terjadi kesalahan saat memuat data"}
            </p>
          )}
  
          {!loading && !error && data.length === 0 && (
            <p className={s.info}>Belum ada produk. Yuk tambahkan produk pertamamu.</p>
          )}
  
          {!loading && !error && data.length > 0 && (
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Gambar</th>
                    <th>Nama Barang</th>
                    <th>Harga</th>
                    <th>Diskon</th>
                    <th>Harga Akhir</th>
                    <th>Stok</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img
                          className={s.thumb}
                          src={item.gambar ? `${BACKEND_ROOT}/uploads/${item.gambar}` : "/placeholder.png"}
                          alt={item.nama_barang}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                        />
                      </td>
                      <td>
                        {item.nama_barang}
                      </td>
                      <td>Rp{item.harga_barang.toLocaleString("id-ID")}</td>
                      <td>{item.diskon_barang > 0 ? `${item.diskon_barang}%` : "-"}</td>
                      <td>
                        Rp
                        {(item.diskon_barang > 0
                          ? item.total_diskon
                          : item.harga_barang
                        ).toLocaleString("id-ID")}
                      </td>
                      <td>{item.stok_barang}</td>
                      <td>
                        <div className={s.actionBtns}>
                          <button
                            className={s.btnSecondary}
                            onClick={() => openEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            className={s.btnDanger}
                            onClick={() => handleHapus(item)}
                            disabled={deletingId === item.id}
                          >
                            {deletingId === item.id ? "Menghapus..." : "Hapus"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
  
          {modalMode && (
            <FormProdukModal
              mode={modalMode}
              initialData={selectedItem}
              saving={saving}
              onClose={closeModal}
              onSubmit={handleSubmit}
            />
          )}
          {actionError && <p className={s.formError}>{actionError}</p>}
        </div>
      </AnimatedContent>
    </>
  );
}