import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import styles from "../styles/ativosPage.module.css"
import { AtivoType } from "../types/ativo.type";
import Ativo from "../components/ativo";
import { Button, Modal } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";

export default function AtivosPage() {
    const [data, setData] = useState<Array<AtivoType>>([]);
    const [filteredData, setFilteredData] = useState<Array<AtivoType>>([]);
    const [manutencoes, setManutencoes] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | unknown>(null);
    const { get } = useAxios();
    const { getCargo, getSub } = useAuth();
    const [filtro, setFiltro] = useState("");
    const [idInput, setIdInput] = useState("");
    const [nomeInput, setNomeInput] = useState("");
    const [statusDisponivel, setStatusDisponivel] = useState(false);
    const [statusEmManutencao, setStatusEmManutencao] = useState(false);
    const [statusOcupado, setStatusOcupado] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; 
    const isFuncionario = getCargo() === "Funcionário";

    const ativos = async () => {
        const rota = getCargo() === "Funcionário" ? `/listar/ativos/${getSub()}` : "/listar/ativos";
        try {
            const response = await get(rota);
            console.log('API response:', response.data); // Adicionado log para debug
            setData(response.data);
            setFilteredData(response.data); // Atualiza filteredData com os dados recebidos
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

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
        setFilteredData(data); // Reseta filteredData com todos os dados
        setCurrentPage(1); // Reset page to 1 when filters are cleared
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

        console.log('Filtered data:', filtered); // Adicionado log para debug
        setFilteredData(filtered);
        setIsModalOpen(false);
        setCurrentPage(1); // Reset page to 1 when filters are applied
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const render = loading ? (
        <div className={styles.listarAtivo}>
            <span className={styles.semAtivos}>
                Carregando ativos...
            </span>
        </div>
    ) : error ? (
        <div className={styles.listarAtivo}>
            <span className={styles.semAtivos}>
                Erro ao carregar ativos! <br />
                :(
            </span>
        </div>
    ) : isMobile ? (
        filteredData.map((ativo) => (
            <Ativo
                key={ativo.id}
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
                codigo_nota_fiscal={ativo.codigo_nota_fiscal}
                isEditable={!isFuncionario}
            />
        ))
    ) : currentItems.length > 0 ? (
        <div className={styles.listarAtivo}>
            {currentItems.map((ativo) => (
                <Ativo
                    key={ativo.id}
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
                    codigo_nota_fiscal={ativo.codigo_nota_fiscal}
                    isEditable={!isFuncionario}
                />
            ))}
        </div>
    ) : (
        <div className={styles.listarAtivo}>
            <span className={styles.semAtivos}>
                Nenhum ativo encontrado! <br />
                :/
            </span>
        </div>
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
                            {render}
                        </div>
                        {!isMobile && filteredData.length > itemsPerPage && (
                            <div className={styles.paginacao}>
                                <button
                                    className={styles.botaoPaginacao}
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    &lt; Anterior
                                </button>
                                <span>{`Página ${currentPage} de ${totalPages}`}</span>
                                <button
                                    className={styles.botaoPaginacao}
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    Próxima &gt;
                                </button>
                            </div>
                        )}
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
