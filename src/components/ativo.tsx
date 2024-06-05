import { useEffect, useState } from 'react'
import { IAtivo } from '../interfaces/ativo'
import styles from '../styles/ativo.module.css'
import ModalAtivo from './modal-ativo'

export default function Ativo(props: IAtivo) {
    const [ativoExpirado] = useState<boolean>(props.expirado)
    const [state, setState] = useState({
        show: false,
        ativoSelecionado: null as IAtivo | null
    })

    const handleClose = () => {
        setState((prevState) => ({
            ...prevState,
            show: false,
            ativoSelecionado: null
        }));
    }

    const handleShow = (ativo: IAtivo) => {
        setState((prevState) => ({
            ...prevState,
            show: true,
            ativoSelecionado: ativo
        }))
    }

    var disponibilidade: string
    var status: string
    switch (props.status.id) {
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

    function classExpirado(): string {
        if (ativoExpirado) {
            return styles.ativo + " " + styles.ativoExpirado
        }

        return styles.ativo
    }

    return (
        <>
            {state.show && state.ativoSelecionado && (
                <ModalAtivo ativo={state.ativoSelecionado} handleClose={handleClose}
                    buscarAtivos={props.buscarAtivos} />
            )}
            <div className={classExpirado()} onClick={() => handleShow(props)}>
                <div className={styles.id}>ID: {props.id} </div>
                <div className={styles.nome}> {props.nome} </div>
                <div className={styles.disponibilidade}>
                    <span className={status} />
                    {disponibilidade}
                </div>
            </div>
        </>
    )
}