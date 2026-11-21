import type { ReactNode } from "react";
import s from "./alertOn.module.css";
import { XIcon } from "@phosphor-icons/react";

interface Props {
  icon: ReactNode;
  text: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AlertOn({ icon, text, isOpen, onClose }: Props) {
  return (
    <div className={`${s.notif} ${isOpen ? s.notifOpen : ""}`}>
      <div className={s.icon}>{icon}</div>
      <div className={s.text}>{text}</div>
      <button className={s.closeBtn} onClick={onClose}>
        <XIcon size={24} weight="duotone" />
      </button>
    </div>
  );
}