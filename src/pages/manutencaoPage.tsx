import { useEffect, useState } from "react";
import Footer from "../components/footer";
import ManutencaoComponent from "../components/manutencao";
import Navbar from "../components/navbar";
import { Manutencao } from "../types/manutencao.type";
import styles from "../styles/manutencaoPage.module.css";
import { useAxios } from "../hooks/useAxios";
import { Link } from "react-router-dom";

export default function ManutencaoPage() {

  let [manutencoes, setManutencoes] = useState<Manutencao[]>([])
  const [error, setError] = useState<Error | unknown>(null)
  const { get, loading, setLoading } = useAxios()

  useEffect(() => {
    buscarManutencoes()
  }, [])

  const buscarManutencoes = async () => {
    get("/manutencao")
      .then(response => {
        let manutencoes = response.data.map((manutencao: any) => {
          return {
            id: manutencao.id,
            nome: manutencao.ativos.nome,
            dataInicio: manutencao.data_inicio,
            dataFinal: manutencao.data_final,
            ativos_id: manutencao.ativos.id,
            localizacao: manutencao.localizacao,
            responsavel: manutencao.responsavel
          }
        })
        setManutencoes(manutencoes)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
      
  }

  var render
  if (loading) {
    render =
      <div className={styles.listarManutencao}>
        <span className={styles.semManutencao}>
          Carregando manutenções...
        </span>
      </div>
  } else if (error) {
    render =
      <div className={styles.listarManutencao}>
        <span className={styles.semManutencao}>
          Erro ao carregar manutenções! <br />
          :(
        </span>
      </div>
  } else if (manutencoes.length > 0) {
    render =
      <div className={styles.listarManutencao}>
        {manutencoes.map(manutencao => {
          return <ManutencaoComponent
            id={manutencao.id}
            nome={manutencao.nome}
            dataInicio={manutencao.dataInicio}
            dataFinal={manutencao.dataFinal}
            localizacao={manutencao.localizacao}
            responsavel={manutencao.responsavel}
            key={manutencao.id}
            ativos_id={manutencao.ativos_id}
            buscarManutencao={buscarManutencoes}
          ></ManutencaoComponent>
        })}
      </div>
  } else {
    render =
      <div className={styles.listarManutencao}>
        <span className={styles.semManutencao}>
          Sem manutenções cadastradas
        </span>
      </div>
  }

  return (
    <div>
      <Navbar local="manutencao" />
      <div className={styles.body}>
        <div className={styles.filtro}></div>
        <div className={styles.conteudo}>
          <main>
            <div className={styles.adicionarManutencao}>
              <Link className={styles.botao} to="/cadastrar/manutencoes">Adicionar Manutenções</Link>
            </div>
            <div className={styles.listarManutencao}>
              {render}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
