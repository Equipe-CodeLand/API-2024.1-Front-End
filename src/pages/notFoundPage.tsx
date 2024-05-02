import Footer from "../components/footer";
import Navbar from "../components/navbar";
import styles from "../styles/notFound.module.css";

export default function NotFoundPage() {
    return(
        <>
            <Navbar local="" />
            <div className={styles.main}>
                <h4>404 - Página não encontrada</h4>
                <Footer></Footer>
            </div>
        </>
    )
}