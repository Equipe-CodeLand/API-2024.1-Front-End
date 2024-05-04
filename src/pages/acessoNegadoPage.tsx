import Footer from "../components/footer";
import Navbar from "../components/navbar";
import styles from "../styles/notFound.module.css";

export default function AcessoNegadoPage() {
    return(
        <>
            <Navbar local="" />
            <div className={styles.main}>
                <h4>Você não tem acesso à essa página</h4>
                <Footer></Footer>
            </div>
        </>
    )
}