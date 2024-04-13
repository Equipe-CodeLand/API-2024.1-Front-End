import { useEffect, useState } from "react";
import Footer from "../components/footer";
import ManutencaoComponent from "../components/manutencao";
import Navbar from "../components/navbar";
import { Manutencao } from "../types/manutencao.type";
import styles from "../styles/manutencaoPage.module.css";
import axios from "axios";

export default function ManutencaoPage() {

  let [manutencoes, setManutencoes] = useState<Manutencao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | unknown>(null)

  useEffect(() => {
    buscarManutencoes()
  }, [])

  const buscarManutencoes = async () => {
    try {
      const response = await fetch("http://localhost:8080/manutencao")
      if (!response.ok) {
        throw new Error("Erro ao buscar manutenções")
      }
      const jsonData = await response.json()
      let manutencoes = jsonData.map((manutencao: any) => {
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
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
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
  } else if (manutencoes.length === 0) {
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
              <a className={styles.botao} href="/cadastrar/manutecoes">Adicionar Manutenções</a>
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
