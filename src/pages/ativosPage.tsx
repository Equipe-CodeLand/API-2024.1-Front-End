import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import styles from "../styles/ativosPage.module.css";
import { useAxios } from "../hooks/useAxios";
import { useAuth } from "../hooks/useAuth";
import { AtivoType } from "../types/ativo.type";
import Ativo from "../components/ativo";
import { Button, Modal } from "react-bootstrap";

export default function AtivosPage() {
    const [data, setData] = useState<Array<AtivoType>>([]);
    const [filteredData, setFilteredData] = useState<Array<AtivoType>>([]);
    const [manutencoes, setManutencoes] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | unknown>(null);
    const { get } = useAxios();
    const { getCargo } = useAuth();
    const [filtro, setFiltro] = useState("");
    const [idInput, setIdInput] = useState("");
    const [nomeInput, setNomeInput] = useState("");
    const [statusDisponivel, setStatusDisponivel] = useState(false);
    const [statusEmManutencao, setStatusEmManutencao] = useState(false);
    const [statusOcupado, setStatusOcupado] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 700);
        };

        window.addEventListener("resize", handleResize);
        ativos();
        chamarManutencoes();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const ativos = async () => {
        try {
            const response = await get("/listar/ativos");
            setData(response.data);
            setFilteredData(response.data);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    const chamarManutencoes = async () => {
        try {
            const response = await get("/manutencao");
            setManutencoes(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const limparFiltros = () => {
        setIdInput("");
        setNomeInput("");
        setFiltro("");
        setStatusDisponivel(false);
        setStatusEmManutencao(false);
        setStatusOcupado(false);
        setFilteredData(data);
    };

    const filtrar = () => {
        let filtered = data;

        if (filtro === "ID" && idInput.trim() !== "") {
            filtered = filtered.filter((ativo) => ativo.id.toString() === idInput);
        } else if (filtro === "Nome" && nomeInput.trim() !== "") {
            filtered = filtered.filter((ativo) => ativo.nome.toLowerCase().includes(nomeInput.toLowerCase()));
        }

        const statusFilters: number[] = [];
        if (statusDisponivel) statusFilters.push(1);
        if (statusEmManutencao) statusFilters.push(2);
        if (statusOcupado) statusFilters.push(3);

        if (statusFilters.length > 0) {
            filtered = filtered.filter((ativo) => statusFilters.includes(ativo.status.id));
        }

        setFilteredData(filtered);
        setIsModalOpen(false);
    };

    return (
        <div>
            <Navbar local="ativos" />
            <div className={styles.body}>
                {isMobile ? (
                    <div className={styles.botoes}>
                        <button className={styles.botao} onClick={() => setIsModalOpen(true)}>
                            Filtro
                        </button>
                        {getCargo() === "Administrador" && (
                            <Link className={styles.botao} to="/cadastrar/ativos">
                                Adicionar Ativo
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className={styles.filtro}>
                        <h2>Filtro</h2>
                        <div className={styles.inputs}>
                            <select
                                name=""
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
                                    value={idInput}
                                    onChange={(e) => setIdInput(e.target.value)}
                                />
                            )}
                            {filtro === "Nome" && (
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    value={nomeInput}
                                    onChange={(e) => setNomeInput(e.target.value)}
                                />
                            )}
                            <hr />
                            <div className={styles.status}>
                                <h4>Status:</h4>
                                <ul>
                                    <li>
                                        <input
                                            type="checkbox"
                                            checked={statusDisponivel}
                                            onChange={(e) => setStatusDisponivel(e.target.checked)}
                                        />
                                        Disponível
                                    </li>
                                    <li>
                                        <input
                                            type="checkbox"
                                            checked={statusEmManutencao}
                                            onChange={(e) => setStatusEmManutencao(e.target.checked)}
                                        />
                                        Em manutenção
                                    </li>
                                    <li>
                                        <input
                                            type="checkbox"
                                            checked={statusOcupado}
                                            onChange={(e) => setStatusOcupado(e.target.checked)}
                                        />
                                        Ocupado
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.filtrar}>
                            <button onClick={limparFiltros}>Limpar</button>
                            <button onClick={filtrar}>Aplicar</button>
                        </div>
                    </div>
                )}
                <div className={styles.conteudo}>
                    <main>
                        {!isMobile && (
                            <div className={styles.botoes}>
                                {getCargo() === "Administrador" && (
                                    <Link className={styles.botao} to="/cadastrar/ativos">
                                        Adicionar Ativo
                                    </Link>
                                )}
                            </div>
                        )}
                        <div className={styles.listarAtivo}>
                            {loading ? (
                                <span className={styles.semAtivos}>
                                    Carregando ativos...
                                </span>
                            ) : error ? (
                                <span className={styles.semAtivos}>
                                    Erro ao carregar ativos! :(
                                </span>
                            ) : filteredData.length > 0 ? (
                                filteredData.map((ativo) => (
                                    <Ativo
                                        id={ativo.id}
                                        nome={ativo.nome}
                                        notaFiscal={ativo.notaFiscal}
                                        descricao={ativo.descricao}
                                        marca={ativo.marca}
                                        modelo={ativo.modelo}
                                        preco_aquisicao={ativo.preco_aquisicao.toFixed(2)}
                                        usuario={ativo.usuario}
                                        setor={ativo.setor}
                                        status={ativo.status}
                                        dataAquisicao={ativo.dataAquisicao}
                                        dataExpiracao={ativo.dataExpiracao}
                                        manutencoes={manutencoes.filter((manutencao) => manutencao.ativos.id === ativo.id)}
                                        buscarAtivos={ativos}
                                        key={ativo.id}
                                    />
                                ))
                            ) : (
                                <span className={styles.semAtivos}>
                                    Nenhum ativo encontrado! :/
                                </span>
                            )}
                        </div>
                    </main>
                </div>
            </div>
            <Footer />
            <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className={styles.modalTitulo}>Filtros</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.bodyModal}>
                        <div className={styles.inputs}>
                            <select
                                name=""
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
                                    value={idInput}
                                    onChange={(e) => setIdInput(e.target.value)}
                                />
                            )}
                            {filtro === "Nome" && (
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    value={nomeInput}
                                    onChange={(e) => setNomeInput(e.target.value)}
                                />
                            )}
                            <div className={styles.status}>
                                <h4>Status:</h4>
                                <br></br>
                                <ul>
                                    <li>
                                        <input
                                            type="checkbox"
                                            checked={statusDisponivel}
                                            onChange={(e) => setStatusDisponivel(e.target.checked)}
                                        />
                                        Disponível
                                    </li>
                                    <li>
                                        <input
                                            type="checkbox"
                                            checked={statusEmManutencao}
                                            onChange={(e) => setStatusEmManutencao(e.target.checked)}
                                        />
                                        Em manutenção
                                    </li>
                                    <li>
                                        <input
                                            type="checkbox"
                                            checked={statusOcupado}
                                            onChange={(e) => setStatusOcupado(e.target.checked)}
                                        />
                                        Ocupado
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.filtrar}>
                            <Button className={styles.botaoModal} onClick={limparFiltros}>
                                Limpar
                            </Button>
                            <Button className={styles.botaoModal} onClick={filtrar}>
                                Aplicar
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
