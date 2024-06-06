import { useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Usuario from "../components/usuario";
import styles from "../styles/usuariosPage.module.css";
import { useAxios } from "../hooks/useAxios";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";

export default function UsuariosPage() {
  const [data, setData] = useState<Array<any>>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | unknown>(null);
  const [ativos, setAtivos] = useState<Array<any>>([]);
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");
  const { get } = useAxios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);

  const chamarAtivos = async () => {
    get("/listar/ativos").then((response) => {
      setAtivos(response.data);
    });
  };

  const usuarios = async () => {
    get("/usuario/listar")
      .then((response) => {
        setData(response.data);
        setUsuariosFiltrados(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const filtrarUsuarios = () => {
    let usuarios = data;

    if (id !== "") {
      usuarios = usuarios.filter((usuario) => usuario.id == id);
    }

    if (nome !== "") {
      usuarios = usuarios.filter((usuario) => usuario.nome.toLowerCase() == nome.toLowerCase());
    }

    if (tipoUsuario !== "") {
      usuarios = usuarios.filter((usuario) => usuario.cargo.id == tipoUsuario);
    }

    setUsuariosFiltrados(usuarios);
    limparFiltros();
  };

  const limparFiltros = () => {
    setId("");
    setNome("");
    setTipoUsuario("");
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    window.addEventListener("resize", handleResize);
    usuarios();
    chamarAtivos();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setUsuariosFiltrados(data); // Exibir todos os usuários em modo mobile
    } else {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setUsuariosFiltrados(data.slice(startIndex, endIndex));
    }
  }, [data, currentPage, isMobile]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  var render;
  if (loading) {
    render = (
      <div className={styles.listarUsuario}>
        <div className={styles.semUsuarios}>Carregando usuários...</div>
      </div>
    );
  } else if (error) {
    render = (
      <div className={styles.listarUsuario}>
        <div className={styles.semUsuarios}>
          Erro ao carregar usuários! <br /> :(
        </div>
      </div>
    );
  } else if (usuariosFiltrados.length > 0) {
    render = (
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
            );
          }
        })}
      </div>
    );
  } else {
    render = (
      <div className={styles.listarUsuario}>
        <div className={styles.semUsuarios}>
          Nenhum usuário encontrado! <br /> :/
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar local="usuarios" />
      <div className={styles.body}>
        <div className={styles.filtro}>
          <h2>Filtro</h2>
          <div className={styles.inputs}>
            <input type="text" placeholder="ID" onChange={(e) => setId(e.target.value)} value={id} />
            <input type="text" placeholder="Nome" onChange={(e) => setNome(e.target.value)} value={nome} />
            <hr />
            <select onChange={(e) => setTipoUsuario(e.target.value)} value={tipoUsuario}>
              <option value="">Filtrar por</option>
              <option value="1">Administrador</option>
              <option value="2">Funcionário</option>
            </select>
          </div>
          <div className={styles.filtrar}>
            <button
              onClick={() => {
                setUsuariosFiltrados(data);
                limparFiltros();
              }}
            >
              Limpar
            </button>
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
            <div className={styles.listarUsuario}>{render}</div>
            {!isMobile && usuariosFiltrados.length > 0 && (
              <div className={styles.paginacao}>
                <button
                  className={styles.botaoPaginacao}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  &lt; Anterior
                </button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  className={styles.botaoPaginacao}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Próxima &gt;
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} className={styles.modal}>
        <Modal.Header closeButton>
          <Modal.Title>Filtros</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.inputs}>
            <input type="text" placeholder="ID" onChange={(e) => setId(e.target.value)} value={id} />
            <input type="text" placeholder="Nome" onChange={(e) => setNome(e.target.value)} value={nome} />
            <select onChange={(e) => setTipoUsuario(e.target.value)} value={tipoUsuario}>
              <option value="">Filtrar por</option>
              <option value="1">Administrador</option>
              <option value="2">Funcionário</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className={styles.filtrar}>
            <button
              onClick={() => {
                setUsuariosFiltrados(data);
                limparFiltros();
              }}
            >
              Limpar
            </button>
            <button onClick={filtrarUsuarios}>Aplicar</button>
          </div>
        </Modal.Footer>
      </Modal>
      <Footer />
    </>
  );
}
