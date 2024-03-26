import styles from "../styles/navbar.module.css"

export default function Navbar() {
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
        </nav>
    );
}