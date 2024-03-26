import styles from "../styles/navbar.module.css"

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <ul>
                <li><a href='/'>Home</a></li>
                <li><a href='/ativos'>Ativos</a></li>
                <li><a href='/manutencao'>Manutenção</a></li>
            </ul>
            <hr />
        </nav>
    );
}