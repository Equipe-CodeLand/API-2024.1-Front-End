import { useEffect, useState } from "react";
import Footer from "../components/footer.component";
import ManutencaoComponent from "../components/manutencao.component";
import Navbar from "../components/navbar.component";
import { Manutencao } from "../types/manutencao.type";
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
            dataInicio: manutencao.dataInicio,
            dataFinal: manutencao.dataFinal,
            idAtivo: manutencao.ativos.id, 
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
                idAtivo={manutencao.idAtivo}
            ></ManutencaoComponent>
        })}
      </div>      
      <Footer />
    </div>
  );
}
