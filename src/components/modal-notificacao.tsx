import { useEffect, useState } from "react";
import { IModalNotificacao } from "../interfaces/modalNotificacao";
import { Modal } from "react-bootstrap";

export default function ModalNotificacao(props: IModalNotificacao) {
    const [show, setShow] = useState(true)
    const [notificacoes, setNotificacoes] = useState([])

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
                {notificacoes.length > 0 ? (
                    notificacoes.map((notificacao: any) => {
                        return (
                            <div key={notificacao.id}>
                                <p>{notificacao.mensagem}</p>
                            </div>
                        )
                    })
                ) : (
                    <p>Não há notificações</p>
                )}
            </Modal.Body>
        </Modal>
    )
}