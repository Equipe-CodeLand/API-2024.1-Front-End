import styles from "../styles/navbar.module.css";
import { useState } from "react";

type props = {
    local: string;
}

export default function Navbar(props: props) {
    const [active, setMode] = useState(false);
    const toggleMode = () => {
        setMode(!active);
        if (active) {
            console.log(props.local)   
        }
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <a href="/">Nome do Sistema</a>
            </div>
            <div className={styles.nav}>
                <ul>
                    <li><a className={(props.local == "ativos") ? styles.mark : ""} href="/ativos">Ativos</a></li>
                    <li><a className={(props.local == "manutencao") ? styles.mark : ""} href="/manutencao">Manutenções</a></li>
                </ul>
            </div>
            <div className={!active ? styles.open : styles.closed }>
                <div className={styles.background} onClick={toggleMode}></div>
                <div className={styles.hamburguer} >
                    <div onClick={toggleMode}></div>
                </div>
                <div className={styles.menu}>
                    <ul>
                        <li><a className={(props.local == "ativos") ? styles.mark : ""} href="/ativos">Ativos</a></li>
                        <li><a className={(props.local == "manutencao") ? styles.mark : ""} href="/manutencao">Manutenções</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}