import { useState } from "react";
import styles from "../styles/manutencao.module.css";
import ModalManutencao from "./modal-manutencao";
import { IManutencao } from "../interfaces/manutencao";

export default function ManutencaoComponent(props: IManutencao) {
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
    return(
        <div>
            {state.show && state.manutencaoSelecionada && (
                <ModalManutencao nomeBotao="Fechar" handleClose={handleClose} manutencao={state.manutencaoSelecionada} />
            )}
            <a
              href="#"
              className="list-group-item-action custom-link"
              onClick={() => handleShow(props)}
            >
            <section className={styles.manutencao}>
                <div className={styles.id}>ID: {props.id}</div>
                <div className={styles.nome}>{props.nome}</div>
                <div className={styles.datas}>{props.dataInicio} - {props.dataFinal}</div>            
            </section>   
            </a>
        </div>
    )
}