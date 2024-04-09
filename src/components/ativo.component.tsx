import styles from '../styles/ativo.module.css'
import { AtivoType } from "../types/ativo.type"

export default function Ativo(props: any) {
    var disponibilidade: string
    var status: string
    switch (props.ativo.status.id) {
        case 1:
            disponibilidade = "Disponível"
            status = styles.verde
            break;
        case 2:
            disponibilidade = "Em manutenção"
            status = styles.vermelho
            break;
        case 3:
            disponibilidade = "Ocupado"
            status = styles.amarelo
            break;
        default:
            status = styles.cinza
            disponibilidade = "Erro"
    }

    function mockFunction() {
        console.log("Clicou")
    }

    return (
        <div className={styles.ativo} onClick={mockFunction}>
            <div className={styles.id}>ID: {props.ativo.id} </div>
            <div className={styles.nome}> {props.ativo.nome} </div>
            <div className={styles.disponibilidade}>
                <span className={status} />
                {disponibilidade}
            </div>
        </div>
    )
}