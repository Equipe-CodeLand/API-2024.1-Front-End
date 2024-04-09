import { useState } from "react";
import { IAtivo } from "../interfaces/ativo";
import { Modal } from "react-bootstrap";
import { IModalAtivo } from "../interfaces/modalAtivo";

export default function ModalAtivo(props: IModalAtivo) {
    const [show, setShow] = useState(true)

    return (
        <>
            <Modal show={show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.ativo.ativo.nome}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>ID: {props.ativo.ativo.id}</p>
                    <p>Descrição: {props.ativo.ativo.descricao}</p>
                    <p>Marca: {props.ativo.ativo.marca}</p>
                    <p>Modelo: {props.ativo.ativo.modelo}</p>
                    <p>Preço de aquisição: {props.ativo.ativo.preco_aquisicao}</p>
                    <p>Funcionário: {props.ativo.ativo.func_id}</p>
                    <p>Setor: {props.ativo.ativo.setor_id}</p>
                    <p>Status: {props.ativo.ativo.status.descricao}</p>
                </Modal.Body>
            </Modal>
        </>
    )
}