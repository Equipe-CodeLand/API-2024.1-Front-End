import { useState } from "react"
import { IUsuario } from "../interfaces/usuario"
import styles from "../styles/usuario.module.css"
import ModalUsuario from "./modal-usuario"

export default function Usuario(props: IUsuario) {
    const [state, setState] = useState({
        show: false,
        usuarioSelecionado: null as IUsuario | null
    })

    const handleClose = () => {
        setState((prevState) => ({
            ...prevState,
            show: false,
            usuarioSelecionado: null
        }));
    }

    const handleShow = (usuario: IUsuario) => {
        setState((prevState) => ({
            ...prevState,
            show: true,
            usuarioSelecionado: usuario
        }))
    }

    if (props.buscarUsuarios != undefined) {
        return (
            <>
                {state.show && state.usuarioSelecionado && (
                    <ModalUsuario usuario={state.usuarioSelecionado} handleClose={handleClose} 
                    buscarUsuarios={props.buscarUsuarios} />
                )}
                <div className={props.estaAtivo ? styles.usuario : styles.estaInativo} onClick={() => handleShow(props)}>
                    <div className={styles.id}>ID: {props.id}</div>
                    <div className={styles.nome}>{props.nome}</div>
                    <div className={styles.cargo}>{props.cargo}</div>
                    <div className={styles.estaAtivo}>{props.estaAtivo ? 'Ativo' : 'Inativo'}</div>
                </div>
            </>
        )
    }

    return (
        <></>
    )
}