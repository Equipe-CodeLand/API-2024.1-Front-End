import { Modal } from "react-bootstrap";
import { IModalUsuario } from "../interfaces/modalUsuario";
import styles from "../styles/modalUsuario.module.css";

export default function ModalUsuario(props: IModalUsuario) {
    const ativos = props.usuario.ativos

    var render
    if (ativos != undefined) {
        if (ativos.length > 0) {
            render =
                <ul>
                    {ativos.map((ativo, index) => {
                        return <li key={index}>
                            <div>{ativo.id} - {ativo.nome}</div>
                        </li>
                    })}
                </ul>
        } else {
            render =
                <div className={styles.semAtivos}>
                    - Não há ativos associados -
                </div>
        }
    }

    return (
        <>
            <Modal show={true} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <div className={styles.id}>
                        <h4>ID: {props.usuario.id}</h4>
                    </div>
                </Modal.Header>
                <Modal.Body className={styles.modal}>
                    <div className={styles.titulo}>
                        <h3>{props.usuario.nome}</h3>
                    </div>
                    <div className={styles.informacoes}>
                        <strong>CPF: </strong>
                        {props.usuario.cpf}
                    </div>
                    <div className={styles.informacoes}>
                        <strong>Cargo: </strong>
                        {props.usuario.cargo}
                    </div>
                    <hr />
                    <div className={styles.ativos}>
                        <strong>Ativos: </strong>
                        {render}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className={styles.botoes}>
                        <button onClick={props.handleClose}>FECHAR</button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}