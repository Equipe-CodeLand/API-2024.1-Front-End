import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { IModalAtivo } from "../interfaces/modalAtivo";
import styles from "../styles/modalAtivo.module.css";
import { FaRegEdit } from "react-icons/fa";
import ButtonMain from "./botao";
import axios from "axios";
import Swal from "sweetalert2";

export default function ModalAtivo(props: IModalAtivo) {
    const [show, setShow] = useState(true)
    const [disponivel, setDisponivel] = useState(true)
    const [ocupado, setOcupado] = useState(false)
    const [emManutencao, setEmManutencao] = useState(false)
    const dataAquisicao = new Date(props.ativo.dataAquisicao)
    const dataExpiracao = new Date(props.ativo.dataExpiracao)

    const manutencoesFuturas = props.ativo.manutencoes.filter((manutencao) => {
        return new Date(manutencao.dataInicio) > new Date()
    })

    const excluirAtivo = () => {
        axios.delete(`http://localhost:8080/delete/ativos/${props.ativo.id}`).then(()=> {
            Swal.fire({
                title: 'Ativo Deletado!',
                text: `O ativo  foi deletado com sucesso!`,
                icon: 'success',
                confirmButtonText: 'OK!'
            })
            setShow(false)
            props.buscarAtivos()
        }).catch()
    }

    const handleDisponivel = () => {
        setDisponivel(!disponivel)
        setOcupado(false)
        setEmManutencao(false)
    }

    const handleOcupado = () => {
        setOcupado(!ocupado)
        setDisponivel(false)
        setEmManutencao(false)
    }

    const handleEmManutencao = () => {
        setEmManutencao(!emManutencao)
        setDisponivel(false)
        setOcupado(false)
    }

    useEffect(() => {
        switch (props.ativo.status.id) {
            case 1:
                setDisponivel(true)
                setOcupado(false)
                setEmManutencao(false)
                break
            case 2:
                setEmManutencao(true)
                setDisponivel(false)
                setOcupado(false)
                break
            case 3:
                setOcupado(true)
                setDisponivel(false)
                setEmManutencao(false)
                break
        }
    }, [])

    var render
    if (manutencoesFuturas.length > 0) {
        render = 
            <ul>
                {manutencoesFuturas.map((manutencao, index) => {
                    return (
                        <li>
                            ID: {manutencao.id} <br />

                            {new Date(manutencao.dataInicio).toLocaleDateString()} - {new Date(manutencao.dataFinal).toLocaleDateString()}
                        </li>
                    )
                })}
            </ul>
    } else {
        render = 
            <div className={styles.semManutencoes}>
                - Não há manutenções futuras -
            </div>
    }

    return (
        <>
            <Modal show={show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <div className={styles.id}>
                        <h4>ID: {props.ativo.id}</h4>
                    </div>
                </Modal.Header>
                <Modal.Body className={styles.modal}>
                    <div className={styles.titulo}>
                        <h3>
                            {props.ativo.nome}
                        </h3>
                        <ButtonMain
                            icon={<FaRegEdit style={{ fontSize: 30 }} />}
                            /* onClick={} */
                        />  
                        
                    </div>
                    <div className={styles.status}>
                        <ul>
                            <li>
                                <input type="checkbox" checked={disponivel} onChange={handleDisponivel} /> Disponivel
                            </li>
                            <li>
                                <input type="checkbox" checked={ocupado} onChange={handleOcupado} /> Ocupado
                            </li>
                            <li>
                                <input type="checkbox" checked={emManutencao} onChange={handleEmManutencao} /> Em manutenção
                            </li>
                        </ul>
                    </div>
                    <div className={styles.informacoes}>
                        <div>
                            <strong>Descrição: </strong> {props.ativo.descricao}
                        </div>
                        <ButtonMain
                            icon={<FaRegEdit style={{ fontSize: 30 }} />}
                            /* onClick={} */
                        />
                    </div>
                    <div className={styles.informacoes}>
                        <div>
                            <strong>Modelo: </strong> {props.ativo.modelo}
                        </div>
                        <ButtonMain
                            icon={<FaRegEdit style={{ fontSize: 30 }} />}
                            /* onClick={} */
                        />
                    </div>
                    <div className={styles.informacoes}>
                        <div>
                            <strong>Marca: </strong> {props.ativo.marca}
                        </div>
                        <ButtonMain
                            icon={<FaRegEdit style={{ fontSize: 30 }} />}
                            /* onClick={} */
                        />
                    </div>
                    <div className={styles.informacoes}>
                        <div>
                            <strong>Preço: </strong> R$ {props.ativo.preco_aquisicao}
                        </div>
                        <ButtonMain
                            icon={<FaRegEdit style={{ fontSize: 30 }} />}
                            /* onClick={} */
                        />
                    </div>
                    <div className={styles.informacoes}>
                        <div>
                            <strong>Data de aquisição: </strong> {dataAquisicao.toLocaleDateString()}
                        </div>
                        <ButtonMain
                            icon={<FaRegEdit style={{ fontSize: 30 }} />}
                            /* onClick={} */
                        />
                    </div>
                    <div className={styles.informacoes}>
                        <div>
                            <strong>Data de expiração: </strong> {dataExpiracao.toLocaleDateString()}
                        </div>
                        <ButtonMain
                            icon={<FaRegEdit style={{ fontSize: 30 }} />}
                            /* onClick={} */
                        />
                    </div>
                    <div className={styles.informacoes}>
                        <div>
                            <strong>Responsável: </strong> {props.ativo.funcionario}
                        </div>
                        <ButtonMain
                            icon={<FaRegEdit style={{ fontSize: 30 }} />}
                            /* onClick={} */
                        />
                    </div>
                    <hr />
                    <div className={styles.manutencoes}>
                        <strong>Manutenções futuras: </strong>
                        {render}
                    </div>
                </Modal.Body>
                <Modal.Footer> 
                    <div className={styles.botoes}>
                        <button className={styles.excluir} onClick={excluirAtivo}>EXCLUIR ATIVO</button>
                        <button className={styles.editar}>ATUALIZAR ATIVO</button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}