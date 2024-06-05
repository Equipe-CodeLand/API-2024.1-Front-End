import { useState } from "react";
import styles from "../styles/manutencao.module.css";
import ModalManutencao from "./modal-manutencao";
import { IManutencao } from "../interfaces/manutencao";

export default function ManutencaoComponent(props: IManutencao) {
  const [manutencaoExpirada] = useState<boolean>(props.expirado);

  const [state, setState] = useState({
    show: false,
    manutencaoSelecionada: null as IManutencao | null,
  });

  const handleClose = () => {
    setState((prevState) => ({
      ...prevState,
      show: false,
      manutencaoSelecionada: null
    }));
  };

  const handleShow = (manutencao: IManutencao) => {
    setState((prevState) => ({
      ...prevState,
      show: true,
      manutencaoSelecionada: manutencao,
    }));
  };

  function classExpirado(): string {
    if (manutencaoExpirada) {
      return styles.manutencao + " " + styles.manutencaoExpirada;
    }

    return styles.manutencao;
  }

  return (
    <div>
      {state.show && state.manutencaoSelecionada && (
        <ModalManutencao
          nomeBotao="Fechar"
          handleClose={handleClose}
          manutencao={state.manutencaoSelecionada}
          buscarManutencao={props.buscarManutencao ? props.buscarManutencao : () => {}}
        />
      )}
      <div className={classExpirado()} onClick={() => handleShow(props)}>
        <div className={styles.id}>ID: {props.id}</div>
        <div className={styles.nome}>{props.nome}</div>
        <div className={styles.datas}>
          {new Date(props.dataInicio).toLocaleDateString()} - {new Date(props.dataFinal).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}