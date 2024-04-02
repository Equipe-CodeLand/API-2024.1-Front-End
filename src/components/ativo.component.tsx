import styles from '../styles/ativo.module.css'

export default function Ativo() {
    return (
        <div className={styles.ativo}>
            <div className={styles.id}></div>
            <div className={styles.nome}></div>
            <div className={styles.disponibilidade}></div>
        </div>
    )
}