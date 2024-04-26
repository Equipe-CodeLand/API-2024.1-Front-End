import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { IModalAtivo } from "../interfaces/modalAtivo";
import styles from "../styles/modalAtivo.module.css";
import { FaRegEdit } from "react-icons/fa";
import ButtonMain from "./botao";
import axios from "axios";
import Swal from "sweetalert2";
import Select from 'react-select';

export default function ModalAtivo(props: IModalAtivo) {

    const [isEditing, setIsEditing] = useState(false);
    const [show, setShow] = useState(true);
    const [disponivel, setDisponivel] = useState(true);
    const [ocupado, setOcupado] = useState(false);
    const [emManutencao, setEmManutencao] = useState(false);

    const [nome, setNome] = useState(props.ativo.nome);
    const [descricao, setDescricao] = useState(props.ativo.descricao);
    const [modelo, setModelo] = useState(props.ativo.modelo);
    const [marca, setMarca] = useState(props.ativo.marca);
    const [preco_aquisicao, setPreco_aquisicao] = useState(props.ativo.preco_aquisicao);
    const [usuario, setUsuario] = useState(props.ativo.usuario);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(props.ativo.usuario);
    const [dataAquisicao, setDataAquisicao] = useState(new Date(props.ativo.dataAquisicao).toLocaleDateString('pt-BR'));
    const [dataExpiracao, setDataExpiracao] = useState(props.ativo.dataExpiracao ? new Date(props.ativo.dataExpiracao).toLocaleDateString('pt-BR') : '');

    const [dataExpiracaoEdit, setDataExpiracaoEdit] = useState('');

    const manutencoesFuturas = props.ativo.manutencoes.filter(
        (manutencao) => new Date(manutencao.data_inicio) > new Date()
    );


    useEffect(() => {
        axios.get('http://localhost:8080/listar/usuarios')
            .then(response => {
                const usuarios = response.data.map((usuario: any) => ({
                    value: usuario,
                    id: usuario.id,
                    label: usuario.nome,
                }));
                setUsuario(usuarios);
            })
            .catch(error => console.error('Erro ao buscar usuários:', error));
    }, []);


    const handleUsuarioSearch = (selectedOption: any) => {
        if (selectedOption) {
            setUsuarioSelecionado(selectedOption);
            console.log(selectedOption)
        } else {
            setUsuarioSelecionado(null);
        }
    };


    const toggleEditing = () => {
        setIsEditing(!isEditing);
        setDataExpiracaoEdit(props.ativo.dataExpiracao ? new Date(props.ativo.dataExpiracao).toLocaleDateString('pt-BR') : '');
    };

    const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setPreco_aquisicao(inputValue); // Corrigido: converter para float
    };

    const saveChanges = () => {
        const statusId = disponivel ? 1 : (ocupado ? 3 : (emManutencao ? 2 : null));
        const formattedDataAquisicao = formatDateForBackend(dataAquisicao);
        const formattedDataExpiracao = formatDateForBackend(dataExpiracaoEdit);

        const ativosDto = {
            nome: nome,
            descricao: descricao,
            modelo: modelo,
            marca: marca,
            preco_aquisicao: parseFloat(preco_aquisicao),
            usuario: usuarioSelecionado,
            dataAquisicao: formattedDataAquisicao,
            dataExpiracao: formattedDataExpiracao,
            status: { id: statusId }
        };


        console.log(ativosDto)
        axios.put(`http://localhost:8080/atualizar/ativos/${props.ativo.id}`, ativosDto)
            .then(response => {
                Swal.fire({
                    title: 'Ativo Atualizado!',
                    text: `O ativo foi atualizado com sucesso!`,
                    icon: 'success',
                    confirmButtonText: 'OK!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        setShow(false);
                        props.buscarAtivos();
                        window.location.reload(); // Recarrega a página após o usuário pressionar "OK"
                    }
                });
            })
            .catch(error => {
                console.error('Erro ao atualizar o ativo:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao atualizar o ativo',
                    text: 'Ocorreu um erro ao tentar atualizar o ativo. Por favor, tente novamente.'
                });
                setShow(false);
                props.buscarAtivos();
            });
    };


    const formatDateForBackend = (dateString: string) => {
        const parts = dateString.split('/');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };
    const excluirAtivo = () => {
        axios.delete(`http://localhost:8080/delete/ativos/${props.ativo.id}`).then(() => {
            Swal.fire({
                title: 'Ativo Deletado!',
                text: `O ativo foi deletado com sucesso!`,
                icon: 'success',
                confirmButtonText: 'OK!'
            })
            setShow(false)
            props.buscarAtivos()
        }).catch()
    }

    const handleDisponivel = () => {
        setDisponivel(true)
        setOcupado(false)
        setEmManutencao(false)
    }

    const handleOcupado = () => {
        setOcupado(true)
        setDisponivel(false)
        setEmManutencao(false)
    }

    const handleEmManutencao = () => {
        setEmManutencao(true)
        setDisponivel(false)
        setOcupado(false)
    }

    useEffect(() => {
        switch (props.ativo.status.id) {
            case 1:
                setDisponivel(true);
                setOcupado(false);
                setEmManutencao(false);
                break;
            case 2:
                setEmManutencao(true);
                setDisponivel(false);
                setOcupado(false);
                break;
            case 3:
                setOcupado(true);
                setDisponivel(false);
                setEmManutencao(false);
                break;
            default:
                break;
        }
    }, [props.ativo.status.id]);

    var render
    if (manutencoesFuturas.length > 0) {
        render =
            <ul>
                {manutencoesFuturas.map((manutencao, index) => {
                    return (
                        <li key={index}> {/* Adicionado: key prop */}
                            ID: {manutencao.id} <br />
                            {new Date(manutencao.data_inicio).toLocaleDateString()} - {new Date(manutencao.data_final).toLocaleDateString()}
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
                            {isEditing ? (
                                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                            ) : (
                                nome
                            )}
                        </h3>
                        <ButtonMain
                            icon={<FaRegEdit style={{ fontSize: 30 }} />}
                            onClick={toggleEditing}
                        />
                    </div>
                    <div className={styles.status}>
                        <ul>
                            <li>
                                <input type="checkbox" checked={disponivel} onChange={handleDisponivel} /> Disponível {/* Corrigido: Disponível */}
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
                            <strong>Descrição: </strong>
                            {isEditing ? (
                                <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                            ) : (
                                props.ativo.descricao
                            )}
                        </div>
                    </div>
                    <div className={styles.informacoes}>
                        <div>
                            <strong>Modelo: </strong>
                            {isEditing ? (
                                <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} />
                            ) : (
                                props.ativo.modelo
                            )}
                        </div>
                    </div>
                    <div className={styles.informacoes}>
                        <div>
                            <strong>Marca: </strong>
                            {isEditing ? (
                                <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} />
                            ) : (
                                props.ativo.marca
                            )}
                        </div>
                    </div>
                    <div className={styles.informacoes}>
                        <div>
                            <strong>Preço de aquisição: </strong>
                            {isEditing ? (
                                <input type="number" className={styles.preco} value={preco_aquisicao} onChange={(e) => handlePrecoChange(e)} />
                            ) : props.ativo.preco_aquisicao}
                        </div>
                    </div>
                    <div className={styles.informacoes}>
                        <div>
                            <strong>Data de aquisição: </strong> {isEditing ? (
                                <input type="text" value={dataAquisicao} onChange={e => setDataAquisicao(e.target.value)} />
                            ) : (
                                new Date(props.ativo.dataAquisicao).toLocaleDateString()
                            )}
                        </div>
                    </div>
                    <div className={styles.informacoes}>
                        <div>
                            <strong>Data de expiração: </strong> {isEditing ? (
                                <input type="text" value={dataExpiracaoEdit} onChange={e => setDataExpiracaoEdit(e.target.value)} placeholder="dd/mm/aaaa" />
                            ) : (
                                props.ativo.dataExpiracao ? new Date(props.ativo.dataExpiracao).toLocaleDateString() : 'Data não especificada'
                            )}
                        </div>
                    </div>
                    <div className={styles.informacoes}>
                        {ocupado && (
                            <>
                                {isEditing ? (
                                    <label>
                                        Responsável:
                                        <Select
                                            options={usuario}
                                            value={usuario.find((user: { id: number; }) => user.id === usuarioSelecionado.id)}
                                            onChange={handleUsuarioSearch}
                                            placeholder="Pesquisar Usuário"
                                            styles={{ control: (provided) => ({ ...provided, borderRadius: '20px' }) }}
                                        />
                                    </label>
                                ) : (
                                    <div>
                                        <strong>Responsável: </strong>
                                        {props.ativo.usuario.nome}
                                    </div>
                                )}
                            </>
                        )}
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
                        {isEditing ? (
                            <button className={styles.editar} onClick={saveChanges}>SALVAR ALTERAÇÕES</button>
                        ) : (
                            <button className={styles.editar} onClick={toggleEditing}>EDITAR</button>
                        )}
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}
