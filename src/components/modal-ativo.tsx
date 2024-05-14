import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { IModalAtivo } from "../interfaces/modalAtivo";
import styles from "../styles/modalAtivo.module.css";
import { FaRegEdit } from "react-icons/fa";
import ButtonMain from "./botao";
import axios from "axios";
import Swal from "sweetalert2";
import Select from 'react-select';

import { useAxios } from "../hooks/useAxios";
import { useAuth } from "../hooks/useAuth";


export default function ModalAtivo(props: IModalAtivo) {
    const [historico, setHistorico] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [show, setShow] = useState(true);
    const [disponivel, setDisponivel] = useState(true);
    const [ocupado, setOcupado] = useState(false);
    const [emManutencao, setEmManutencao] = useState(false);

    const [nome, setNome] = useState(props.ativo.nome);
    const [notaFiscal, setNotaFiscal] = useState(props.ativo.notaFiscal);
    const [descricao, setDescricao] = useState(props.ativo.descricao);
    const [modelo, setModelo] = useState(props.ativo.modelo);
    const [marca, setMarca] = useState(props.ativo.marca);
    const [preco_aquisicao, setPreco_aquisicao] = useState(props.ativo.preco_aquisicao);
    const [usuario, setUsuario] = useState(props.ativo.usuario);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(props.ativo.usuario);
    const [usuarioPreenchido, setUsuarioPreenchido] = useState(false);
    const [dataAquisicao, setDataAquisicao] = useState(new Date(props.ativo.dataAquisicao).toLocaleDateString('pt-BR'));

    const [dataExpiracaoEdit, setDataExpiracaoEdit] = useState('');
    const [dataExpiracao, setDataExpiracao] = useState(new Date(props.ativo.dataExpiracao).toLocaleDateString('pt-BR'));
    const { get, post, put, deletar } =  useAxios()
    const { getCargo } = useAuth()


    const manutencoesFuturas = props.ativo.manutencoes.filter(
        (manutencao) => new Date(manutencao.data_inicio) > new Date()
    );


    useEffect(() => {
        get('/usuario/listar')
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

    useEffect(() => {
        // Função para buscar o histórico do usuário ao abrir o modal
        const fetchHistorico = async () => {
            try {
                const response = await get(`/listar/historico/${props.ativo.id}`);
                setHistorico(response.data);
            } catch (error) {
                console.error('Erro ao buscar histórico do usuário:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao buscar histórico do usuário',
                    text: 'Ocorreu um erro ao tentar buscar o histórico do usuário. Por favor, tente novamente.'
                });
            }
        };

        fetchHistorico();
    }, [props.ativo.id]);


    const handleUsuarioSearch = (selectedOption: any) => {
        if (selectedOption) {
            setUsuarioSelecionado(selectedOption);
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

        if (ocupado && !usuarioSelecionado) {
            Swal.fire({
                icon: 'error',
                title: 'Campo obrigatório',
                text: 'Por favor, preencha o campo do funcionário responsável.',
            });
            return;
        }

        if (!nome || !preco_aquisicao || !dataAquisicao) {
            Swal.fire({
                icon: 'error',
                title: 'Campos obrigatórios',
                html: 'Por favor, preencha todos os campos obrigatórios:<br>(Nome, Preço de Aquisição e Data de Aquisição)',
            });
            return;
        }

        const statusId = disponivel ? 1 : (ocupado ? 3 : (emManutencao ? 2 : null));
        const formattedDataAquisicao = formatDateForBackend(dataAquisicao);
        const formattedDataExpiracao = formatDateForBackend(dataExpiracaoEdit);

        const ativosDto = {
            nome: nome,
            notaFiscal: notaFiscal,
            descricao: descricao,
            modelo: modelo,
            marca: marca,
            preco_aquisicao: parseFloat(preco_aquisicao),
            usuario: usuarioSelecionado,
            dataAquisicao: formattedDataAquisicao,
            dataExpiracao: formattedDataExpiracao,
            status: { id: statusId }
        };

        put(`/atualizar/ativos/${props.ativo.id}`, ativosDto)
            .then(response => {
                // Verifica se o status foi alterado para "Ocupado"
                if (statusId === 3 && props.ativo.usuario?.id !== usuarioSelecionado?.id) {
                    // Se sim, adiciona um novo histórico
                    post(`/adicionar/historico/${props.ativo.id}`, {})
                        .then(() => {
                            Swal.fire({
                                title: 'Ativo Atualizado!',
                                text: `O ativo foi atualizado com sucesso e um novo histórico foi adicionado!`,
                                icon: 'success',
                                confirmButtonText: 'OK!'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    setShow(false);
                                    props.buscarAtivos();
                                    // window.location.reload();
                                }
                            });
                        })
                        .catch((error) => {
                            console.error('Erro ao adicionar novo histórico:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Erro ao adicionar novo histórico',
                                text: 'Ocorreu um erro ao tentar adicionar um novo histórico. Por favor, tente novamente.'
                            });
                        });
                } else {
                    Swal.fire({
                        title: 'Ativo Atualizado!',
                        text: `O ativo foi atualizado com sucesso!`,
                        icon: 'success',
                        confirmButtonText: 'OK!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            setShow(false);
                            props.buscarAtivos();
                            window.location.reload();
                        }
                    });
                }
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
        if (dateString !== "") {
            const parts = dateString.split('/');
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return null
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const excluirAtivo = () => {
        deletar(`/delete/ativos/${props.ativo.id}`).then(() => {
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
        setDisponivel(true);
        setOcupado(false);
        setEmManutencao(false);
        setUsuarioSelecionado(null);
    };

    const handleOcupado = () => {
        setOcupado(true);
        setDisponivel(false);
        setEmManutencao(false);
    };

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
                setDisponivel(false);
                setOcupado(true);
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
                        { getCargo() === "Administrador" ? 
                            <ButtonMain
                            icon={<FaRegEdit style={{ fontSize: 30 }} />}
                            onClick={toggleEditing}
                        /> : '' }
                    </div>
                    {
                        isEditing && props.ativo.status.id !== 2 ? <>
                            <div className={styles.status}>
                                <ul>
                                    <li>
                                        <input type="checkbox" checked={disponivel} onChange={handleDisponivel} /> Disponível {/* Corrigido: Disponível */}
                                    </li>
                                    <li>
                                        <input type="checkbox" checked={ocupado} onChange={handleOcupado} /> Ocupado
                                    </li>
                                </ul>
                            </div>
                        </> : !isEditing ? <div className={styles.informacoes}>
                            <div>
                                <strong>Status: </strong> {props.ativo.status.nome_status}
                            </div>
                        </div> : ''
                    }
                    
                    <div className={styles.informacoes}>
                        <div>
                            <strong>Código da Nota Fiscal: </strong>
                            {isEditing ? (
                                <input type="text" value={notaFiscal} onChange={(e) => setNotaFiscal(e.target.value)} />
                            ) : (
                                props.ativo.notaFiscal
                            )}
                        </div>
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
                                        <strong>Responsável: </strong>
                                        <Select
                                            options={usuario}
                                            value={usuario.find((user: { id: number; }) => user.id === (usuarioSelecionado ? usuarioSelecionado.id : null))}
                                            onChange={handleUsuarioSearch}
                                            placeholder="Pesquisar Usuário"
                                            styles={{ control: (provided) => ({ ...provided, borderRadius: '20px' }) }}
                                        />
                                    </label>
                                ) : (
                                    <div>
                                        <strong>Responsável: </strong>
                                        {props.ativo.usuario?.nome}
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

                    <hr />
                    <div className={styles.historico}>
                        <strong>Histórico: </strong>
                        {historico.length > 0 ? (
                            <ul>
                                {historico.map((historico: any, index: number) => (
                                    <li key={index}>
                                        <p>Usuário: {historico.usuario?.nome}</p>
                                        <p>Data de cadastro: {formatDate(historico.data_cadastro)}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className={styles.semHistorico}>
                                - Não há histórico -
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    { getCargo() === "Administrador" ?
                        <div className={styles.botoes}>
                            <button className={styles.excluir} onClick={excluirAtivo}>EXCLUIR ATIVO</button>
                            {isEditing ? (
                                <button className={styles.editar} onClick={saveChanges}>SALVAR ALTERAÇÕES</button>
                            ) : (
                                <button className={styles.editar} onClick={toggleEditing}>EDITAR</button>
                            )}
                        </div> : ''
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}