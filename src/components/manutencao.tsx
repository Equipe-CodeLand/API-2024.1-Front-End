import styles from "../styles/manutencao.module.css";

type props = {
    id: number,
    nome: string,
    dataInicio: string,
    dataFinal: string
}

export default function ManutencaoComponent(props: props) {
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