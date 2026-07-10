import { Link } from "react-router-dom"
import type { ReactNode } from "react"
import s from "./nav.module.css"

interface props {
    left?: ReactNode,
    leftAct?: string,
    title: string,
    right?: ReactNode,
    rightAct?: string
}

export default function Nav({ left, leftAct, title, right, rightAct }: props) {

    const isLeftEmpty = !left || leftAct === "" || !leftAct

    const isRightEmpty = !right || rightAct === "" || !rightAct

    return (
        <nav className={s.nav}>
            <Link 
                to={isLeftEmpty ? "#" : leftAct || "/"}
                className={isLeftEmpty ? s.disabled : ""}
                onClick={(e) => isLeftEmpty && e.preventDefault()}
            >
                <div>{left}</div>
            </Link>
            <h1>{title}</h1>
            <Link 
                to={isRightEmpty ? "#" : rightAct || "/"}
                className={`right${isRightEmpty ? s.disabled : ""}`}
                onClick={(e) => isRightEmpty && e.preventDefault()}
            >
                <div>{right}</div>
            </Link>
        </nav>
    )
}