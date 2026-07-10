import s from "./hero.module.css";
import makanan from "../../assets/img/aa.png";
import CloudLayout from "../../components/commonts/CloudLayout";
import { ArrowDownIcon } from "@phosphor-icons/react";
import AnimatedContent from "../../animation/AnimatedContent";

export default function Hero() {
  function scn() {
    const vh = window.innerHeight / 100;
    window.scrollTo({
      top: 100 * vh,
      behavior: "smooth",
    });
  }
  return (
    <AnimatedContent delay={0} duration={1} animateOpacity distance={100}>
      <div className={s.hero}>
        <div className={s.img}>
          <AnimatedContent
            distance={100}
            direction="vertical"
            reverse={false}
            duration={1.5}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
          >
            <img src={makanan} alt="bro" />
          </AnimatedContent>
        </div>
        <CloudLayout />
        <div className={s.con_hero}>
          <div className={s.starr}>
            <AnimatedContent  delay={0.35} duration={0.7} scale={0} distance={0}>
              <p>✦</p>
            </AnimatedContent>
          </div>
          <AnimatedContent delay={0.5} duration={1} distance={20}>
            <h1>Bynna's Shop</h1>
          </AnimatedContent>
          
            <AnimatedContent className={s.deskripsi} delay={0.75} duration={1} distance={20}>
              Disini kamu bisa pesan apa saja yang ku jual. Mau lihat lebih
              lanjut?, Scroll kebawah yaa :3
            </AnimatedContent>
          
  
          <h5>
            <AnimatedContent delay={0.75} threshold={0} duration={1} distance={20}>
              — Savoir-faire
            </AnimatedContent>
          </h5>
          <AnimatedContent delay={0.85} threshold={0} duration={0.7} scale={0} distance={0}>
            <button onClick={scn}>
              <ArrowDownIcon size={24} weight="duotone" />
            </button>
          </AnimatedContent>
        </div>
        <div className={s.text_scroll}>
          <div className={s.marquee}>
            <p>bynna's shop</p>
            <p>mari dibelii :3</p>
            <p>bynna's shop</p>
            <p>mari dibelii :3</p>
            <p>bynna's shop</p>
            <p>mari dibelii :3</p>
            <p>bynna's shop</p>
            <p>mari dibelii :3</p>
            <p>bynna's shop</p>
            <p>mari dibelii :3</p>
            <p>bynna's shop</p>
            <p>mari dibelii :3</p>
          </div>
        </div>
      </div>
    </AnimatedContent>
    
  );
}
