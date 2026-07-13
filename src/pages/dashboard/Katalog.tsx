import s from "./katalog.module.css";
import { useState } from "react";
import Modals from "../../components/commonts/modals";
import useProduk, { type Produk, getGambarUrl } from "../../hooks/useProduk";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
const FALLBACK_IMG = "../../assets/img/alert.webp";
export default function Katalog() {
  const { data, loading, error } = useProduk();
  const [selectedItem, setSelectedItem] = useState<Produk | null>(null);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");

  const handleSearch = () => {
    setAppliedQuery(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    setAppliedQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const filteredData = appliedQuery
    ? data.filter((item) =>
        item.nama_barang.toLowerCase().includes(appliedQuery.toLowerCase()),
      )
    : data;

  return (
    <div className={s.katalog} id="katalog">
      <div className={s.con_search}>
        <div className={s.searchBox}>
          <input
            type="text"
            className={s.searchInput}
            placeholder="Cari sesuatu?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {appliedQuery && (
            <button
              type="button"
              className={s.clearBtn}
              onClick={handleClear}
              aria-label="Hapus pencarian"
            >
              <XIcon size={18} weight="duotone" />
            </button>
          )}
          <button
            type="button"
            className={s.searchBtn}
            onClick={handleSearch}
            aria-label="Cari"
          >
            <MagnifyingGlassIcon size={20} weight="duotone" />
          </button>
        </div>
      </div>
      {error && <p className={s.error}>{String(error)}</p>}
      <div className={s.con_items}>
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ display: "none" }} className={`${s.item} ${s.skeleton}`} />
          ))}
        {!loading && !error && filteredData.length === 0 && (
          <p className={s.notFound}>Produk "{appliedQuery}" gak ditemuin <br /> Coba cari yang lain</p>
        )}
        {!loading &&
          !error &&
          filteredData.map((item: Produk) => {
            const habis = item.stok_barang === 0;
            return (
              <div
                onClick={() => setSelectedItem(item)}
                className={`${s.item} ${habis ? s.habis : ""}`}
                key={item.id}
              >
                <span className={s.diskon} style={{display: item.diskon_barang ? "block" : "none"}}>
                  Diskon {item.diskon_barang}%
                </span>
                <img
                  className={s.img}
                  src={getGambarUrl(item.gambar) ?? FALLBACK_IMG}
                  alt={item.nama_barang}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                />
                <div className={s.con_text}>
                  <h1>{item.nama_barang}</h1>
                  <p>Rp.{item.harga_barang.toLocaleString("id-ID")}</p>
                  {habis && <span className={s.badgeHabis}><p>Stok Habis</p></span>}
                </div>
              </div>
            );
          })}
      </div>
      {selectedItem && (
        <Modals item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}