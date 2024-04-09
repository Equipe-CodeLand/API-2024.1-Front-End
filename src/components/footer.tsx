import styles from "../styles/footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <hr />
            <p>Desenvolvido por: <a href="https://github.com/Equipe-CodeLand">Equipe CodeLand</a></p>
        </footer>
    )
}