import styles from '../styles/ativo.module.css'

type props = {
    id: number,
    nome: string,
    disponibilidade: string
}

export default function Ativo(props: props) {
    var disponibilidade: string
    var status: string
    switch (props.disponibilidade) {
        case "1":
            disponibilidade = "Disponível"
            status = styles.verde
            break;
        case "2":
            disponibilidade = "Em manutenção"
            status = styles.vermelho
            break;
        case "3":
            disponibilidade = "Indisponível"
            status = styles.amarelo
            break;
        default:
            status = styles.cinza
            disponibilidade = "Erro"
    }

    return (
        <a className={styles.ativo} href='#'>
            <div className={styles.id}>ID: {props.id} </div>
            <div className={styles.nome}> {props.nome} </div>
            <div className={styles.disponibilidade}>
                <span className={status}>
                    {disponibilidade}
                </span>
            </div>
        </a>
    )
}