import { useCart } from "../../context/CartContext";
import s from "./keranjang.module.css";
import Nav from "../../components/layouts/Nav";
import CloudLayout from "../../components/commonts/CloudLayout";
import {
  ArrowLeftIcon,
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

export default function Keranjang() {
  const { cartItems, removeFromCart, updateQty, totalHarga } =
    useCart();
  const API_BASE = import.meta.env.VITE_API;
  const BACKEND_ROOT = API_BASE.replace(/\/api\/?$/, "");
  const FALLBACK_IMG = "../../assets/img/alert.webp";
  const WA_NUMBER = import.meta.env.VITE_WA;
  const { showAlert } = useAlert();

  const checkoutWhatsapp = () => {
    if (cartItems.length === 0) {
      showAlert((<WarningIcon size={24} weight="duotone"/>), "Keranjang masih kosong")
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
  };

  return (
    <div className={s.keranjang}>
      <Nav
        left={<ArrowLeftIcon size={24} weight="duotone" />}
        leftAct="/"
        title="Bynna'shop Charts"
        right={<UserIcon size={24} weight="duotone" />}
        rightAct="/adminnyasabrina"
      />
      {cartItems.length === 0 ? (
        <p className={s.kosong}>
          Saat ini anda <br /> tidak memesan apa-apaa
        </p>
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
                    src={
                      item.gambar
                        ? `${BACKEND_ROOT}/uploads/${item.gambar}`
                        : FALLBACK_IMG
                    }
                    alt={item.namaBarang}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMG;
                    }}
                  />
                  <div className={s.info}>
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
          <button className={s.checkout} onClick={checkoutWhatsapp}>
            Chat Whatsapp <WhatsappLogoIcon size={24} weight="duotone" />
          </button>
        </div>
      </AnimatedContent>
    </div>
  );
}
