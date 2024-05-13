import { useEffect, useState } from "react"
import Footer from "../components/footer"
import Navbar from "../components/navbar"
import Usuario from "../components/usuario"
import styles from "../styles/usuariosPage.module.css"
import { useAxios } from "../hooks/useAxios"
import { Link } from "react-router-dom"


export default function UsuariosPage() {
    const [data, setData] = useState<Array<any>>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | unknown>(null)
    const [ativos, setAtivos] = useState<Array<any>>([])
    const { get } = useAxios()

    const chamarAtivos = async () => {
        get("/listar/ativos")
            .then(response => {
                setAtivos(response.data)
            })
    }

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
        chamarAtivos()
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
                if (usuario !== undefined) {
                    return (
                        <Usuario
                            id = {usuario.id}
                            nome = {usuario.nome}
                            cargo = {usuario.cargo.nome}
                            cpf = {usuario.credencial.cpf}
                            key = {usuario.id}
                            buscarUsuarios={usuarios}
                            ativos = {ativos.filter((ativo: any) => ativo.usuario?.id === usuario?.id)}
                         />
                    )
                }
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
                        <div className={styles.botoes}>
                            <div className={styles.trocarSenha}>
                                <Link className={styles.botao} to="/alteracao/senha">
                                    Trocar minha senha
                                </Link>
                            </div>
                            <div className={styles.adicionarUsuario}>
                                <Link className={styles.botao} to="/cadastrar/usuarios">
                                    Adicionar Usuário
                                </Link>
                            </div>
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