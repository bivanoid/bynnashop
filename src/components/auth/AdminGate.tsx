import { useState, type ReactNode, type FormEvent } from "react";
import s from "./adminGate.module.css";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, LockKeyOpenIcon } from "@phosphor-icons/react";

const ADMIN_PASSWORD = "bynaagimasak"; //sengaja ku show bre
const SESSION_KEY = "admin_authed";

export default function AdminGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true",
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setAuthed(true);
    } else {
      setError("Password salah");
    }
  };

  if (authed) return <>{children}</>;

  return (
    <div className={s.password_page}>
      <h2>Apakah kamu admin?</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwordnya ap cb"
          autoFocus
        />
        <div className={s.con_btn}>
          <Link className={s.btn} to={"/keranjang"}>
            <ArrowLeftIcon size={24} weight="duotone" />
          </Link>
          <button className={s.btn} type="submit">
            <LockKeyOpenIcon size={24} weight="duotone" />
          </button>
        </div>
      </form>
      {error && <p cla style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
