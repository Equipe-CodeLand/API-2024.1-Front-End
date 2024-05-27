import { useEffect, useState } from "react"
import Footer from "../components/footer"
import Navbar from "../components/navbar"
import Usuario from "../components/usuario"
import styles from "../styles/usuariosPage.module.css"
import { useAxios } from "../hooks/useAxios"
import { Link } from "react-router-dom"
import { Modal } from "react-bootstrap"


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
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const toTitleCase = (str: string) =>
        str
          .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          ?.map((x) => x.charAt(0).toUpperCase() + x.slice(1))
          .join(" ");

    const filtrarUsuarios = () => {
        let usuarios = data

        if (id !== "") {
            usuarios = usuarios.filter((usuario) => usuario.id == id)
        }

        if (nome !== "") {
            usuarios = usuarios.filter((usuario) => 
                toTitleCase(usuario.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ")[0]) == 
                toTitleCase(nome.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
            )
        }

        if (tipoUsuario !== "") {
            usuarios = usuarios.filter((usuario) => usuario.cargo.id == tipoUsuario)
        }

        setUsuariosFiltrados(usuarios)
        limparFiltros()
    }

    const limparFiltros = () => {
        setId("")
        setNome("")
        setTipoUsuario("")
        setIsModalOpen(false)
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
                                email={usuario.email}
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

    return(
        <>
            <Navbar local="usuarios"/>
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
                        <button onClick={() => {
                            setUsuariosFiltrados(data)
                            limparFiltros()
                        }}>Limpar</button>
                        <button onClick={filtrarUsuarios}>Aplicar</button>
                    </div>
                </div>
                <div className={styles.conteudo}>
                    <main>
                        <div className={styles.botoes}>
                            <div className={styles.botaoFiltro}>
                                <button className={styles.botao} onClick={() => setIsModalOpen(true)}>
                                    Filtros
                                </button>
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
            <Modal
                show={isModalOpen}
                onHide={() => setIsModalOpen(false)}
                className={styles.modal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Filtros</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                        <select
                            onChange={(e) => setTipoUsuario(e.target.value)}
                            value={tipoUsuario}
                        >
                            <option value="">Filtrar por</option>
                            <option value="1">Administrador</option>
                            <option value="2">Funcionário</option>
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className={styles.filtrar}>
                        <button onClick={() => {
                            setUsuariosFiltrados(data)
                            limparFiltros()
                        }}>Limpar</button>
                        <button onClick={filtrarUsuarios}>Aplicar</button>
                    </div>
                </Modal.Footer>
            </Modal>
            <Footer />
        </>
    )
}