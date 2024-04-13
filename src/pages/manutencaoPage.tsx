import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Footer from "../components/footer";
import ManutencaoComponent from "../components/manutencao";
import Navbar from "../components/navbar";
import { Manutencao } from "../types/manutencao.type";
import styles from "../styles/manutencao.module.css";
import axios from "axios";

export default function ManutencaoPage() {

  let [manutencoes, setManutencoes] = useState<Manutencao[]>([])

  useEffect(() => {
    buscarManutencoes()
  }, [])

  function buscarManutencoes() {
    axios.get(`http://localhost:8080/manutencao`)
      .then(res => {
        console.log(res.data)
        let manutencoes = res.data.map((manutencao:any) => {
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
      })
  }
  return (
    <div>
      <Navbar local="manutencao" />
      <div className={styles.container}>
        <Link to="/cadastrar/manutencoes">
        <button>Adicionar Manutenção</button>
        </Link>
        <div>
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
      </div>
      <Footer />
    </div>
  );
}
