import { useEffect, useState } from 'react'
import { IAtivo } from '../interfaces/ativo'
import styles from '../styles/ativo.module.css'
import ModalAtivo from './modal-ativo'

export default function Ativo(props: IAtivo) {
    const [ativoExpirado, setAtivoExpirado] = useState<boolean>(false)
    const faltam3diasParaExpiracao: boolean = false
    const faltam15diasParaExpiracao: boolean = false
    const [state, setState] = useState({
        show: false,
        ativoSelecionado: null as IAtivo | null
    })

    useEffect(() => {
        if (new Date(props.dataExpiracao) < new Date()) {
            setAtivoExpirado(true)
        } else {
            setAtivoExpirado(false)
        }
    }, [])

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

    function classDisponibilidade(): string {
        if (ativoExpirado) {
            return styles.ativo + " " + styles.ativoExpirado
        }

        if (faltam3diasParaExpiracao) {
            return styles.ativo + " " + styles.faltam3diasParaExpiracao
        }

        if (faltam15diasParaExpiracao) {
            return styles.ativo + " " + styles.faltam15diasParaExpiracao
        }

        return styles.ativo
    }

    return (
        <>
            {state.show && state.ativoSelecionado && (
                <ModalAtivo ativo={state.ativoSelecionado} handleClose={handleClose}
                    buscarAtivos={props.buscarAtivos} />
            )}
            <div className={classDisponibilidade()} onClick={() => handleShow(props)}>
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