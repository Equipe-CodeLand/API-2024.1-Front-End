import { useEffect, useState } from "react"
import Footer from "../components/footer"
import Navbar from "../components/navbar"
import Usuario from "../components/usuario"
import styles from "../styles/usuariosPage.module.css"
import { useAxios } from "../hooks/useAxios"



export default function UsuariosPage() {
    const [data, setData] = useState<Array<any>>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | unknown>(null)
    const { get } = useAxios()

    const usuarios = async () => {
        get("/usuario/listar")
            .then(response => {
                setData(response.data)
                setLoading(false)
            })
            .catch(error => {
                setError(error)
                setLoading(false)
            })
    }

    useEffect(() => {
        usuarios()
    }, [])

    var render
    if (loading) {
        render = 
        <div className={styles.listarUsuario}>
            <div className={styles.semUsuarios}>
                Carregando usuários...
            </div>
        </div>
    } else if (error) {
        render = 
        <div className={styles.listarUsuario}>
            <div className={styles.semUsuarios}>
                Erro ao carregar usuários! <br />
                :(  
            </div>
        </div>
    } else if (data.length > 0) {
        render = 
        <div className={styles.listarUsuario}>
            {data.map((usuario) => {
                return (
                    <Usuario
                        id = {usuario.id}
                        nome = {usuario.nome}
                        cargo = {usuario.cargo.nome}
                        key = {usuario.id}
                     />
                )
            })}
        </div>
    } else {
        render =
        <div className={styles.listarUsuario}>
            <div className={styles.semUsuarios}>
                Nenhum usuário encontrado! <br />
                :/
            </div>
        </div>
    }

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
                            { render }
                        </div>
                    </main>
                </div>
            </div>
            <Footer />
        </>
    )
}