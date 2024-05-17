import { useEffect, useState } from "react"
import Footer from "../components/footer"
import Navbar from "../components/navbar"
import Usuario from "../components/usuario"
import styles from "../styles/usuariosPage.module.css"
import { useAxios } from "../hooks/useAxios"
import { Link } from "react-router-dom"


export default function UsuariosPage() {
    const [data, setData] = useState<Array<any>>([])
    const [usuariosFiltrados, setUsuariosFiltrados] = useState<Array<any>>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | unknown>(null)
    const [ativos, setAtivos] = useState<Array<any>>([])
    const [id, setId] = useState("")
    const [nome, setNome] = useState("")
    const [tipoUsuario, setTipoUsuario] = useState("")
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
                setUsuariosFiltrados(response.data)
                setLoading(false)
            })
            .catch(error => {
                setError(error)
                setLoading(false)
            })
    }

    const filtrarUsuarios = () => {
        let usuarios = data

        if (id != "") {
            usuarios = usuarios.filter((usuario) => usuario.id == id)
        }

        if (nome != "") {
            usuarios = usuarios.filter((usuario) => usuario.nome == nome)
        }

        if (tipoUsuario != "") {
            usuarios = usuarios.filter((usuario) => usuario.cargo.id == tipoUsuario)
        }

        setUsuariosFiltrados(usuarios)
        limparFiltros()
    }

    const limparFiltros = () => {
        setId("")
        setNome("")
        setTipoUsuario("")
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
    } else if (usuariosFiltrados.length > 0) {
        render =
            <div className={styles.listarUsuario}>
                {usuariosFiltrados.map((usuario) => {
                    if (usuario !== undefined) {
                        return (
                            <Usuario
                                id={usuario.id}
                                nome={usuario.nome}
                                cargo={usuario.cargo.nome}
                                cpf={usuario.credencial.cpf}
                                key={usuario.id}
                                buscarUsuarios={usuarios}
                                estaAtivo={usuario.estaAtivo}
                                ativos={ativos.filter((ativo: any) => ativo.usuario?.id === usuario?.id)}
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

    return (
        <>
            <Navbar local="usuarios" />
            <div className={styles.body}>
                <div className={styles.filtro}>
                    <h2>Filtro</h2>
                    <div className={styles.inputs}>
                        <input
                            type="text"
                            placeholder="ID"
                            onChange={(e) => setId(e.target.value)}
                            value={id}
                        />
                        <input
                            type="text"
                            placeholder="Nome"
                            onChange={(e) => setNome(e.target.value)}
                            value={nome}
                        />
                        <hr />
                        <select
                            onChange={(e) => setTipoUsuario(e.target.value)}
                            value={tipoUsuario}
                        >
                            <option value="">Filtrar por</option>
                            <option value="1">Administrador</option>
                            <option value="2">Funcionário</option>
                        </select>
                    </div>
                    <div className={styles.filtrar}>
                        <button onClick={filtrarUsuarios}>Aplicar</button>
                    </div>
                </div>
                <div className={styles.conteudo}>
                    <main>
                        <div className={styles.botoes}>
                            <div className={styles.botaoFiltro}>
                                <Link className={styles.botao} to="#">
                                    Filtros
                                </Link>
                            </div>
                            <div className={styles.adicionarUsuario}>
                                <Link className={styles.botao} to="/cadastrar/usuarios">
                                    Adicionar Usuário
                                </Link>
                            </div>
                        </div>
                        <div className={styles.listarUsuario}>
                            {render}
                        </div>
                    </main>
                </div>
            </div>
            <Footer />
        </>
    )
}