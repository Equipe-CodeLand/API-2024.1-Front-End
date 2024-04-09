import styles from "../styles/manutencao.module.css";
import { Manutencao } from "../types/manutencao.type";

export default function ManutencaoComponent(props: Manutencao) {
    return(
        <div>
            <section className={styles.manutencao}>
                <div className={styles.id}>ID: {props.id}</div>
                <div className={styles.nome}>{props.nome}</div>
                <div className={styles.datas}>{props.dataInicio} - {props.dataFinal}</div>            
            </section>   
        </div>
    )
}