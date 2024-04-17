import styles from "../styles/usuario.module.css"

export default function Usuario(props: any) {
    return (
        <>
            <div className={styles.usuario} onClick={() => {console.log("usuario")}}>
                <div className={styles.id}>ID: 1</div>
                <div className={styles.nome}>Nome_Funcionario</div>
                <div className={styles.cargo}>Administrador</div>
                <div className={styles.setor}>Setor de prototipagem</div>
            </div>
        </>
    )
}