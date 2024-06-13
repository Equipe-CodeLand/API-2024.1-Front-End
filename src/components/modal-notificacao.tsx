import { useEffect, useState } from "react";
import { IModalNotificacao } from "../interfaces/modalNotificacao";
import { Modal } from "react-bootstrap";
import styles from "../styles/modalNotificacao.module.css";

export default function ModalNotificacao(props: IModalNotificacao) {
    const [show, setShow] = useState(true)
    const [notificacoes, setNotificacoes] = useState([])

    function limparNotificacoes() {
        localStorage.removeItem("notificacoes");
        setNotificacoes([])
    }

    useEffect(() => {
        const listaJsonRecuperada = localStorage.getItem("notificacoes");
        const listaRecuperada = JSON.parse(listaJsonRecuperada || "[]");
        setNotificacoes(listaRecuperada)
    })

    return (
        <Modal show={show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Histórico de Notificações</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className={styles.listaDeNotificacoes}>
                    {notificacoes.length > 0 ? (
                        notificacoes.map((notificacao: any) => {
                            return (
                                <li
                                    key={notificacao.id}
                                    className={styles.itemDaNotificacao}
                                >
                                    <p>{notificacao.mensagem}</p>
                                </li>
                            )
                        })
                    ) : (
                        <p className={styles.semNotificacoes}>- Não há notificações -</p>
                    )}
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <div className={styles.footer}>
                    <button className={styles.button} onClick={limparNotificacoes}>Limpar</button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}