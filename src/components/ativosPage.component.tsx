import styles from "../styles/ativosPage.module.css"
import Ativo from "./ativo.component";

export default function AtivosPage() {
    return (
        <div className={styles.body}>
            <div className={styles.filtro}></div>
            <div className={styles.conteudo}>
                <main>
                    <div className={styles.adicionarAtivo}></div>
                    <div className={styles.listarAtivo}>
                        <Ativo />
                        <Ativo />
                        <Ativo />
                        <Ativo />
                    </div>
                </main>
            </div>
        </div>
    );
}