import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import ManutencaoComponent from "../components/manutencao";
import Navbar from "../components/navbar";
import styles from "../styles/manutencaoPage.module.css";
import { useAxios } from "../hooks/useAxios";
import { Button, Modal, ToastContainer } from "react-bootstrap";
import { Manutencao } from "../types/manutencao.type";
import { notificacaoProps } from "../types/notificacaoProps.type";
import stylesNotificacao from "../styles/notificacao.module.css";
import Notificacao from "../components/notificacao";

export default function ManutencaoPage() {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [error, setError] = useState<Error | unknown>(null);
  const [filteredData, setFilteredData] = useState<Array<Manutencao>>([]);
  const { get, loading, setLoading } = useAxios();
  const [idInput, setIdInput] = useState("");
  const [nomeInput, setNomeInput] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [filtro, setFiltro] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
  const [notificaoMostrada, setNotificacaoMostrada] = useState<boolean>(false);
  const [notificacoes, setNotificacoes] = useState<notificacaoProps[]>([]);

  const verificarDataFinal = (manutencao: Manutencao): number => {
    let dataAtual = new Date()

    let manutencaoDia = new Date(manutencao.data_final).getDate()
    let manutencaoMes = new Date(manutencao.data_final).getMonth() + 1
    let manutencaoAno = new Date(manutencao.data_final).getFullYear()
    let manutencaoTotal = manutencaoDia + "/" + manutencaoMes + "/" + manutencaoAno
    let diaAtualDia = dataAtual.getDate()
    let diaAtualMes = dataAtual.getMonth() + 1
    let diaAtualAno = dataAtual.getFullYear()
    let diaAtualTotal = diaAtualDia + "/" + diaAtualMes + "/" + diaAtualAno

    if (manutencaoTotal === diaAtualTotal) return 1

    let data3diasAtras = new Date(dataAtual.setDate(dataAtual.getDate() - 3))
    let daqui3dias = new Date(dataAtual.setDate(dataAtual.getDate() + 6))
    dataAtual.setDate(dataAtual.getDate() - 3)

    if (new Date(manutencao.data_inicio) <= daqui3dias && new Date(manutencao.data_inicio) >= dataAtual) {
      return 2
    }

    if (new Date(manutencao.data_final) <= daqui3dias && new Date(manutencao.data_final) >= dataAtual) {
      return 3
    }

    return 0
  }

  const mostrarNotificacoes = () => {
    const listaDeNotificacoes: notificacaoProps[] = [];
    filteredData.forEach((manutencao) => {
      let notificacao: notificacaoProps | undefined = undefined
      switch (verificarDataFinal(manutencao)) {
        case 1: // manutencao finalizada
          notificacao = {
            titulo: `Manutenção Finalizada - #${manutencao.id}`,
            texto: `A manutenção do ativo ${manutencao.ativos.nome} #${manutencao.ativos.id} foi finalizada!`,
            repetirNotificacao: false
          }
          break
        case 2: // manutencao em 3 dias
          let diasParaInicioDaManutencao = Math.ceil((new Date(manutencao.data_inicio).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          notificacao = {
            titulo: `Manutenção próxima - #${manutencao.id}`,
            texto: `Uma manutenção do ativo ${manutencao.ativos.nome} #${manutencao.ativos.id} ira começar em ${diasParaInicioDaManutencao} ${diasParaInicioDaManutencao === 1 ? "dia" : "dias"}!`,
            repetirNotificacao: false
          }
          break
        case 3:
          let diasParaFimDaManutencao = Math.ceil((new Date(manutencao.data_final).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          notificacao = {
            titulo: `Manutenção em andamento - #${manutencao.id}`,
            texto: `A manutenção do ativo ${manutencao.ativos.nome} #${manutencao.ativos.id} está em andamento e irá terminar em ${diasParaFimDaManutencao} ${diasParaFimDaManutencao === 1 ? "dia" : "dias"}!`,
            repetirNotificacao: false
          }
          break
        case 0:
          console.log("sem notificacao")
          break
        default:
          break
      }
      if (notificacao !== undefined) listaDeNotificacoes.push(notificacao)
    })
    setNotificacoes(listaDeNotificacoes)
  }

  useEffect(() => {
    if (filteredData.length > 0 && !notificaoMostrada) {
      mostrarNotificacoes();
      setNotificacaoMostrada(true);
    }
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    window.addEventListener("resize", handleResize);
    buscarManutencoes();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const buscarManutencoes = async () => {
    try {
      const response = await get("/manutencao");
      const manutencoesData = response.data.map((manutencao: any) => ({
        id: manutencao.id,
        nome: manutencao.ativos.nome,
        dataInicio: manutencao.data_inicio,
        dataFinal: manutencao.data_final,
        ativos_id: manutencao.ativos.id,
        localizacao: manutencao.localizacao,
        responsavel: manutencao.responsavel,
      }));
      setManutencoes(manutencoesData);
      setFilteredData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const limparFiltros = () => {
    setIdInput("");
    setNomeInput("");
    setDataInicio("");
    setDataFinal("");
    setFiltro("");
    setFilteredData(manutencoes);
    buscarManutencoes();
  };

  const toTitleCase = (str: string) =>
    str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      ?.map((x) => x.charAt(0).toUpperCase() + x.slice(1))
      .join(" ");

  const filtrar = async () => {
    setLoading(true);

    try {
      let response;

      if (idInput) {
        response = await get(`/manutencao/${idInput}`);
      } else if (nomeInput) {
        response = await get(`/manutencao`);
        response.data = response.data.filter((manutencao: any) =>
          manutencao.ativos.nome.toLowerCase().includes(nomeInput.toLowerCase())
        );
      } else if (dataInicio && dataFinal) {
        const dataInicioFormatada = formatarData(dataInicio);
        const dataFinalFormatada = formatarData(dataFinal);
        response = await get(`/manutencao/filtrar/dataInicio/dataFinal?dataInicio=${dataInicioFormatada}&dataFinal=${dataFinalFormatada}`);
      } else if (dataInicio !== "") {
        response = await get(`/manutencao/filtrar/dataInicio?dataInicio=${dataInicio}`);
      } else if (dataFinal !== "") {
        response = await get(`/manutencao/filtrar/dataFinal?dataFinal=${dataFinal}`);
      } else {
        return;
      }

      let data = Array.isArray(response.data) ? response.data : [response.data];

      const manutencoesFiltradas = data.map((manutencao: any) => ({
        id: manutencao.id,
        nome: manutencao.ativos.nome,
        dataInicio: manutencao.data_inicio ? `${manutencao.data_inicio[0]}-${manutencao.data_inicio[1]}-${manutencao.data_inicio[2]}` : "",
        dataFinal: manutencao.data_final ? `${manutencao.data_final[0]}-${manutencao.data_final[1]}-${manutencao.data_final[2]}` : "",
        ativos_id: manutencao.ativos.id,
        localizacao: manutencao.localizacao,
        responsavel: manutencao.responsavel,
      }));

      console.log(manutencoesFiltradas);
      setManutencoes(manutencoesFiltradas);
      setLoading(false);
      setFilteredData(manutencoesFiltradas);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao filtrar manutenções:", error);
      setError(error);
      setLoading(false);
    }
  };


  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split("-");
    return `${ano}-${mes}-${dia}`;
  };

  return (
    <div>
      <Navbar local="manutencao" />
      <div>
        <div className={styles.body}>
          <div className={styles.filtro}>
            <h2>Filtro</h2>
            <div className={styles.inputs}>
              <select
                name=""
                id="filtrarPor"
                className={`${styles.filtrarPor}`}
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
                  className={styles.idInput}
                  onChange={(e) => setIdInput(e.target.value)}
                />
              )}
              {filtro === "Nome" && (
                <input
                  type="text"
                  placeholder="Nome"
                  value={nomeInput}
                  className={styles.nomeInput}
                  onChange={(e) => setNomeInput(e.target.value)}
                />
              )}
              <hr />
              <div>
                <label>Data Início</label>
                <input
                  type="date"
                  placeholder="Data Início"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div>
                <label>Data Final</label>
                <input
                  type="date"
                  placeholder="Data Final"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.filtrar}>
              <button onClick={limparFiltros}>Limpar</button>
              <button onClick={filtrar}>Aplicar</button>
            </div>
          </div>
          <div className={styles.conteudo}>
            <main>
              <div className={styles.botoes}>
                {isMobile && (
                  <div className={styles.filtroModal}>
                    <button className={styles.botao} onClick={() => setIsModalOpen(true)}>
                      Filtro
                    </button>
                  </div>
                )}
                <div className={styles.adicionarManutencao}>
                  <Link className={styles.botao} to="/cadastrar/manutencoes">
                    Adicionar Manutenções
                  </Link>
                </div>
              </div>
              <div className={styles.listarManutencao}>
                {loading ? (
                  <span className={styles.semManutencao}>Carregando manutenções...</span>
                ) : error ? (
                  <span className={styles.semManutencao}>Erro ao carregar manutenções! :(</span>
                ) : manutencoes.length > 0 ? (
                  manutencoes.map((manutencao) => {
                    let expirado = false
                    if (manutencao.dataFinal !== null && new Date(manutencao.dataFinal) <= new Date()) {
                      expirado = true
                    }
                    return (
                      <ManutencaoComponent
                        id={manutencao.id}
                        nome={manutencao.nome}
                        dataInicio={manutencao.dataInicio}
                        dataFinal={manutencao.dataFinal}
                        localizacao={manutencao.localizacao}
                        responsavel={manutencao.responsavel}
                        key={manutencao.id}
                        ativos_id={manutencao.ativos_id}
                        buscarManutencao={filtro ? undefined : buscarManutencoes}
                        expirado = {expirado}
                      />
                    )
                  })
                ) : (
                  <span className={styles.semManutencao}>Sem manutenções cadastradas</span>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
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
                className="filtrarPor"
                value={filtro}
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
              <div>
                <label>Data Início</label>
                <input
                  type="date"
                  placeholder="Data Início"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div>
                <label>Data Final</label>
                <input
                  type="date"
                  placeholder="Data Final"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                />
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
      <Footer />
      <ToastContainer className={stylesNotificacao.notificacoes}>
        {notificacoes.map((notificacao, index) => {
          return <Notificacao
            id={index.toString()}
            key={index}
            titulo={notificacao.titulo}
            texto={notificacao.texto}
            repetirNotificacao={notificacao.repetirNotificacao}
          />
        })}
      </ToastContainer>
    </div>
  );
}