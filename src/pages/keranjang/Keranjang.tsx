import { useCart } from "../../context/CartContext";
import s from "./keranjang.module.css";
import Nav from "../../components/layouts/Nav";
import CloudLayout from "../../components/commonts/CloudLayout";
import { supabase } from "../../lib/supabase";
import { getGambarUrl } from "../../hooks/useProduk";
import {
  ArrowLeftIcon,
  EmptyIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
  WarningIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react";
import AnimatedContent from "../../animation/AnimatedContent";
import FadeContent from "../../animation/FadeContent";
import { useAlert } from "../../context/AlertContext";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Keranjang() {
  const { cartItems, removeFromCart, updateQty, totalHarga, clearCart } =
    useCart();
  const FALLBACK_IMG = "../../assets/img/alert.webp";
  const WA_NUMBER = import.meta.env.VITE_WA;
  const { showAlert } = useAlert();
  const [processing, setProcessing] = useState(false);

  const checkoutWhatsapp = async () => {
    if (cartItems.length === 0) {
      showAlert((<WarningIcon size={24} weight="duotone"/>), "Keranjang masih kosong")
      return;
    }

    setProcessing(true);
    try {
      const hasil = await Promise.all(
        cartItems.map((item) =>
          supabase.rpc("kurangi_stok", { item_id: item.id, jumlah: item.qty }),
        ),
      );

      const adaError = hasil.find((r) => r.error);
      if (adaError?.error) {
        showAlert(
          (<WarningIcon size={24} weight="duotone" />),
          "Gagal memperbarui stok, coba lagi",
        );
        return;
      }

      const pesan = cartItems
        .map((item, index) => {
          const hargaFinal =
            item.diskonBarang === 0
              ? item.hargaBarang
              : (item.totalDiskon ?? item.hargaBarang);

          const subtotal = hargaFinal * item.qty;

          return `${index + 1}. ${item.namaBarang}
  Jumlah : ${item.qty}
  Subtotal : Rp${subtotal.toLocaleString("id-ID")}`;
        })
        .join("\n\n");

      const text = `Halo, saya ingin memesan barang berikut.

  ${pesan}

  ====================
  Total Belanja
  Rp${totalHarga.toLocaleString("id-ID")}

  Terima kasih.`;
      window.open(
        `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`,
        "_blank",
      );
      clearCart();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={s.keranjang}>
      <Nav
        left={<ArrowLeftIcon size={24} weight="duotone" />}
        leftAct="/"
        title="Keranjang"
        right={<UserIcon size={24} weight="duotone" />}
        rightAct="/adminnyasabrina"
      />
      {cartItems.length === 0 ? (
        <div className={s.kosong}>
          <EmptyIcon size={46} weight="duotone" />
          <p><span>Keranjangmu kosong nih</span> <br />Coba deh pesen sesuatu :3</p>
          <Link to={"/"}>Beranda</Link>
        </div>
      ) : (
        <FadeContent>
          <div className={s.list}>
            {cartItems.map((item) => {
              const hargaFinal =
                item.diskonBarang === 0
                  ? item.hargaBarang
                  : (item.totalDiskon ?? item.hargaBarang);
              return (
                <div className={s.item} key={item.id}>
                  <img
                    className={s.img}
                    src={getGambarUrl(item.gambar) ?? FALLBACK_IMG}
                    alt={item.namaBarang}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMG;
                    }}
                  />
                  <div className={s.info}>
                    <span className={s.diskon} style={{display: item.diskonBarang ? "block" : "none"}}>
                      Diskon {item.diskonBarang}%
                    </span>
                    <h2>{item.namaBarang}</h2>
                    <div className={s.qty_control}>
                      <p>Rp.{hargaFinal.toLocaleString("id-ID")}</p>
                      <button
                        disabled={item.qty <= 1}
                        onClick={() => updateQty(item.id, item.qty - 1)}
                      >
                        <MinusIcon size={18} weight="duotone"/>
                      </button>
                      <span>{item.qty}</span>
                      <button
                        disabled={item.qty >= item.stokBarang}
                        onClick={() => updateQty(item.id, item.qty + 1)}
                      >
                        <PlusIcon size={18} weight="duotone"/>
                      </button>
                    </div>
                  </div>
                  <div className={s.subtotal_hapus}>
                    <p className={s.subtotal}>
                      Total per item : Rp.
                      {(hargaFinal * item.qty).toLocaleString("id-ID")}
                    </p>
                    <button
                      className={s.hapus}
                      onClick={() => removeFromCart(item.id)}
                    >
                      Hapus <TrashIcon size={18} weight="duotone" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>{" "}
        </FadeContent>
      )}
      <AnimatedContent
        className={s.con_ringkasan}
        delay={0}
        threshold={0}
        duration={1}
        animateOpacity
        distance={100}
      >
        <div className={s.ringkasan}>
          <CloudLayout top="-2rem" />
          {/*<button className={s.clear} onClick={clearCart}>
            <XIcon size={14} weight="duotone" /> Clear All
          </button>*/}
          <div className={s.total}>
            <p>Total Belanja</p>
            <h2>Rp.{totalHarga.toLocaleString("id-ID")}</h2>
          </div>
          <button className={s.checkout} onClick={checkoutWhatsapp} disabled={processing}>
            {processing ? "Memproses..." : "Chat"}{" "}
            <WhatsappLogoIcon size={24} weight="duotone" />
          </button>
        </div>
      </AnimatedContent>
    </div>
  );
}
