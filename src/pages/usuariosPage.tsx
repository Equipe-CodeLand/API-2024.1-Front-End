import Footer from "../components/footer"
import Navbar from "../components/navbar"
import Usuario from "../components/usuario"
import styles from "../styles/usuariosPage.module.css"



export default function UsuariosPage() {
    var render
    return(
        <>
            <Navbar local="usuarios"/>
            <div className={styles.body}>
                <div className={styles.filtro}></div>
                <div className={styles.conteudo}>
                    <main>
                        <div className={styles.adicionarUsuario}>
                            <a className={styles.botao} href="/cadastrar/usuarios">
                                Adicionar Usuário
                            </a>
                        </div>
                        <div className={styles.listarUsuario}>
                            <Usuario />
                            <Usuario />
                            <Usuario />
                            <Usuario />
                        </div>
                    </main>
                </div>
            </div>
            <Footer />
        </>
    )
}