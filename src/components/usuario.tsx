import styles from "../styles/usuario.module.css"
import { UsuarioType } from "../types/usuario.type"

export default function Usuario(props: UsuarioType) {
    return (
        <>
            <div className={styles.usuario} onClick={() => {console.log("usuario")}}>
                <div className={styles.id}>ID: {props.id}</div>
                <div className={styles.nome}>{props.nome}</div>
                <div className={styles.cargo}>{props.cargo}</div>
            </div>
        </>
    )
}