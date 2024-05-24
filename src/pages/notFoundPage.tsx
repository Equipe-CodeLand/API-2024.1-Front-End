import { Link } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import styles from "../styles/notFound.module.css";

export default function NotFoundPage() {
    return (
        <>
            <Navbar local="" />
            <main className={styles.main}>
                <h2>404 - Página não encontrada</h2>
                <Link to="/home">Ir para página inicial.</Link>
            </main>
            <Footer></Footer>
        </>
    )
}