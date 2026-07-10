import useFetch from "../../hooks/useFetch";
import s from "./katalog.module.css";
import { useState } from "react";
import Modals from "../../components/commonts/modals";

interface Produk {
  id: number;
  nama_barang: string;
  harga_barang: number;
  gambar: string | null;
}

const FALLBACK_IMG = "../../assets/img/alert.webp";

export default function Katalog() {
  const [selectedItem, setSelectedItem] = useState<Produk | null>(null);
  const API_BASE = import.meta.env.VITE_API;
  const BACKEND_ROOT = API_BASE.replace(/\/api\/?$/, "");
  const { data, loading, error } = useFetch(`${API_BASE}/getProduk.php`);

  return (
    <div className={s.katalog} id="katalog">
      <div className={s.informasi}>
        <p>Silahkan dipesan :v</p>
      </div>

      {error && <p className={s.error}>{String(error)}</p>}

      <div className={s.con_items}>
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`${s.item} ${s.skeleton}`} />
          ))}

        {!loading &&
          !error &&
          data.map((item: Produk) => (
            <div
              onClick={() => setSelectedItem(item)}
              className={s.item}
              key={item.id}
            >
              <img
                className={s.img}
                src={
                  item.gambar
                    ? `${BACKEND_ROOT}/uploads/${item.gambar}`
                    : FALLBACK_IMG
                }
                alt={item.nama_barang}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMG;
                }}
              />
              <div className={s.con_text}>
                <h1>{item.nama_barang}</h1>
                <p>Rp.{item.harga_barang.toLocaleString("id-ID")}</p>
              </div>
            </div>
          ))}
      </div>

      {selectedItem && (
        <Modals item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}