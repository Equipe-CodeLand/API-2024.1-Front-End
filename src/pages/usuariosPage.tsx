import { useEffect, useState } from "react"
import Footer from "../components/footer"
import Navbar from "../components/navbar"
import Usuario from "../components/usuario"
import styles from "../styles/usuariosPage.module.css"
import { useAxios } from "../hooks/useAxios"
import { Link } from "react-router-dom"
import { Modal } from "react-bootstrap"
import { useAuth } from "../hooks/useAuth"


export default function UsuariosPage() {
    const [data, setData] = useState<Array<any>>([])
    const [usuariosFiltrados, setUsuariosFiltrados] = useState<Array<any>>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | unknown>(null)
    const [ativos, setAtivos] = useState<Array<any>>([])
    const [filtro, setFiltro] = useState("");
    const [id, setId] = useState("")
    const [nome, setNome] = useState("")
    const [isAdministrador, setIsAdministrador] = useState(false);
    const [isFuncionario, setIsFuncionario] = useState(false);
    const [isInativo, setIsInativo] = useState(false);
    const [isAtivo, setIsAtivo] = useState(false);
    const [tipoUsuario, setTipoUsuario] = useState("")
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { get } = useAxios()
    const { getCargo, getSub } = useAuth();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 700);
        };

        window.addEventListener("resize", handleResize);
        usuarios();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

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

        if (id !== "") {
            usuarios = usuarios.filter((usuario) => usuario.id == id)
        }

        if (nome !== "") {
            usuarios = usuarios.filter((usuario) => 
                usuario.nome?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(
                    nome?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
                )
            )
        }

        if (isAdministrador || isFuncionario) {
            const cargoFilters: number[] = [];
            if (isAdministrador) cargoFilters.push(1);
            if (isFuncionario) cargoFilters.push(2);
    
            usuarios = usuarios.filter((usuario) => cargoFilters.includes(usuario.cargo.id));
        }
    
        if (isInativo || isAtivo) {
            const statusFilters: number[] = [];
            if (isInativo) statusFilters.push(0);
            if (isAtivo) statusFilters.push(1);
    
            usuarios = usuarios.filter((usuario) => 
                (isAtivo && usuario.estaAtivo) || (isInativo && !usuario.estaAtivo)
            );
        }

        setUsuariosFiltrados(usuarios)
        limparFiltros()
    }

    const limparFiltros = () => {
        setId("")
        setNome("")
        setTipoUsuario("")
        setFiltro("")
        setIsAdministrador(false)
        setIsFuncionario(false)
        setIsInativo(false)
        setIsAtivo(false)
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
                            <select
                                id="filtrarPor"
                                className={styles.filtrarPor}
                                onChange={(e) => setFiltro(e.target.value)}
                            >
                                <option value="">Filtrar por</option>
                                <option value="ID">ID</option>
                                <option value="Nome">Nome</option>
                            </select>
                            {filtro === "ID" && (
                                <input
                                    type="number"
                                    placeholder="ID"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                />
                            )}
                            {filtro === "Nome" && (
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            )}
                        <hr />
                        <div>
                            <div className={styles.cargoCheck}>
                                <h4>Cargo:</h4>
                                <ul>
                                    <li>
                                        <input
                                            type="checkbox"
                                            checked={isAdministrador}
                                            onChange={(e) => setIsAdministrador(e.target.checked)}
                                        />
                                        Administrador
                                    </li>
                                    <li>
                                        <input
                                            type="checkbox"
                                            checked={isFuncionario}
                                            onChange={(e) => setIsFuncionario(e.target.checked)}
                                        />
                                        Funcionário
                                    </li>
                                </ul>
                            </div>
                            <div className={styles.status}>
                                <h4>Status:</h4>
                                <ul>
                                    <li>
                                        <input
                                            type="checkbox"
                                            checked={isAtivo}
                                            onChange={(e) => setIsAtivo(e.target.checked)}
                                        />
                                        Ativo
                                    </li>
                                    <li>
                                        <input
                                            type="checkbox"
                                            checked={isInativo}
                                            onChange={(e) => setIsInativo(e.target.checked)}
                                        />
                                        Inativo
                                    </li>
                                </ul>
                            </div>
                        </div>
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
                            <select
                                id="filtrarPor"
                                className={styles.filtrarPor}
                                onChange={(e) => setFiltro(e.target.value)}
                            >
                                <option value="">Filtrar por</option>
                                <option value="ID">ID</option>
                                <option value="Nome">Nome</option>
                            </select>
                            {filtro === "ID" && (
                                <input
                                    type="number"
                                    placeholder="ID"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                />
                            )}
                            {filtro === "Nome" && (
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            )}
                        <hr />
                        <div className={styles.cargoCheck}>
                            <h4>Cargo:</h4>
                                <ul>
                                    <li>
                                        <input
                                            type="checkbox"
                                            checked={isAdministrador}
                                            onChange={(e) => setIsAdministrador(e.target.checked)}
                                        />
                                        Administrador
                                    </li>
                                    <li>
                                        <input
                                            type="checkbox"
                                            checked={isFuncionario}
                                            onChange={(e) => setIsFuncionario(e.target.checked)}
                                        />
                                        Funcionário
                                    </li>
                                    <li>
                                        <input
                                            type="checkbox"
                                            checked={isAtivo}
                                            onChange={(e) => setIsAtivo(e.target.checked)}
                                        />
                                        Ativo
                                    </li>
                                    <li>
                                        <input
                                            type="checkbox"
                                            checked={isInativo}
                                            onChange={(e) => setIsInativo(e.target.checked)}
                                        />
                                        Inativo
                                    </li>
                                </ul>
                        </div>
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