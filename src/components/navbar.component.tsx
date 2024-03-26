import styles from "../styles/navbar.module.css"
import { useState } from "react";

export default function Navbar() {
    const [active, setMode] = useState(false);
    const toggleMode = () => {
        setMode(!active);
        if (active) {
            console.log("Fechado")
        } else {
            console.log("Aberto")
        }
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <a href="/">Nome do Sistema</a>
            </div>
            <div className={styles.nav}>
                <ul>
                    <li><a href="/ativos">Ativos</a></li>
                    <li><a href="/manutencao">Manutenções</a></li>
                </ul>
            </div>
            <div className={!active ? styles.open : styles.closed }>
                <div className={styles.background} onClick={toggleMode}></div>
                <div className={styles.hamburguer} onClick={toggleMode}></div>
                <div className={styles.menu}>
                    <ul>
                        <li><a href="/ativos">Ativos</a></li>
                        <li><a href="/manutencao">Manutenções</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}