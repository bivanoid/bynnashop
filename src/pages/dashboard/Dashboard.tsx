import s from "./Dashboard.module.css";

import Hero from "./Hero";
import { ShoppingCartIcon } from "@phosphor-icons/react";

import Nav from "../../components/layouts/Nav";
import Katalog from "./Katalog";
import { InstagramLogoIcon } from "@phosphor-icons/react/dist/ssr";

export default function Dashboard() {
  return (
    <div className={s.dashboard}>
      <Nav
        left={<InstagramLogoIcon size={28} weight="duotone"/>}
        leftAct="https://www.instagram.com/bynnaowll?igsh=Nm13eHNraGJmN2Z2"
        title="Bynna's Shop"
        right={<ShoppingCartIcon size={24} weight="duotone"/>}
        rightAct="/keranjang"
      />
      <Hero />
      <Katalog />
    </div>
  );
}
