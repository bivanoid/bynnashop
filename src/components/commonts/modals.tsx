import s from "./modals.module.css";
import CloudLayout from "./CloudLayout";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { CheckIcon, MinusIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import { BasketIcon } from "@phosphor-icons/react/dist/ssr";
import { useAlert } from "../../context/AlertContext";
import { createPortal } from "react-dom";
interface props {
  item: any;
  onClose: () => void;
}

export default function Modals({ item, onClose }: props) {
  const [isOpen, setIsOpen] = useState(false); 
  const [count, setCount] = useState<number>(1);
  const [min, setMin] = useState<boolean>(false);
  const [max, setMax] = useState<boolean>(false);
  const API_BASE = import.meta.env.VITE_API;
  const BACKEND_ROOT = API_BASE.replace(/\/api\/?$/, "");
  const FALLBACK_IMG = "../../assets/img/alert.webp";
  const { showAlert } = useAlert();
  const {
    id,
    nama_barang: namaBarang,
    deskripsi_barang: deskripsiBarang,
    gambar,
    harga_barang: hargaBarang,
    diskon_barang: diskonBarang,
    stok_barang: stokBarang,
    total_diskon: totalDiskon,
  } = item;

  const hargaFinalnya =
    diskonBarang === 0 ? hargaBarang : (totalDiskon ?? hargaBarang);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  function handleClose() {
    setIsOpen(false);
    setTimeout(() => onClose(), 500); 
  }

  useEffect(() => {
    setMin(count === 0);
    setMax(count === stokBarang);
  }, [count, stokBarang]);

  const { addToCart } = useCart();
  
  function handleAddToCart() {
    addToCart(
      { id, namaBarang, gambar, hargaBarang, diskonBarang, totalDiskon, stokBarang },
      count,
    );
    showAlert((<CheckIcon size={24} weight="duotone"/>), `${namaBarang} ada di keranjang`);
    handleClose();
  }

  return createPortal (
    <div
      className={`${s.overlay} ${isOpen ? s.overlayOpen : ""}`}
      onClick={handleClose}
    >
      <div key={id} className={`${s.modalBox} ${isOpen ? s.open_modalBox : ""}`} onClick={(e) => e.stopPropagation()}>
        <CloudLayout />
        <div className={s.title}>
          <div className={s.con_product}>
            <h1>{namaBarang}</h1>
            <p>
              <span className={diskonBarang == 0 ? s.disable : s.harga_coret}>
                {diskonBarang == 0 ? "" : `Rp.${hargaBarang}`}
              </span>
              <span className={s.harga_final}>Rp.{hargaFinalnya.toLocaleString("id-ID")} </span>
              <span className={diskonBarang == 0 ? s.disable : s.discount}>
                {diskonBarang == 0 ? "" : `${diskonBarang}%`}
              </span>
            </p>
          </div>
          <button className={s.close_btn} onClick={handleClose}>
            <XIcon size={24} weight="duotone"/>
          </button>
        </div>
        <div className={s.con_content}>
          <div className={s.con_img_content}>
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
            <div className={s.con_deskripsi}>
              <p>Stok Tersisa : {stokBarang}</p>
              <p>{deskripsiBarang}</p>
            </div>
          </div>
          <div className={s.con_button}>
            <div className={s.con_stok}>
              <button disabled={min} onClick={() => setCount(count - 1)}><MinusIcon size={24} weight="duotone"/></button>
              <p>Dipesan : {count}</p>
              <button disabled={max} onClick={() => setCount(count + 1)}><PlusIcon size={24} weight="duotone"/></button>
            </div>
            <button className={s.add} onClick={handleAddToCart}>
              Pesan Sekarang <BasketIcon size={24} weight="duotone"/>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}