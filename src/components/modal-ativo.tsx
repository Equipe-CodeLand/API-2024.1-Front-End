import { useState, useEffect, ChangeEvent } from "react";
import { IModalAtivo } from "../interfaces/modalAtivo";
import styles from "../styles/modalAtivo.module.css";
import Swal from "sweetalert2";
import Select from 'react-select';
import { FaRegEdit } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import { useAxios } from "../hooks/useAxios";
import { useAuth } from "../hooks/useAuth";
import BuscadorArquivos from "../buscadores/buscadorArquivo";
import { TbTrash } from "react-icons/tb";
import ButtonMain from "./botao";

export default function ModalAtivo(props: IModalAtivo) {
    const [historico, setHistorico] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [show, setShow] = useState(true);
    const [disponivel, setDisponivel] = useState(true);
    const [ocupado, setOcupado] = useState(false);
    const [emManutencao, setEmManutencao] = useState(false);

    const [nome, setNome] = useState(props.ativo.nome || '');
    const [notaFiscal, setNotaFiscal] = useState<File | null>(null);
    const [codigoNotaFiscal, setCodigoNotaFiscal] = useState(props.ativo.codigo_nota_fiscal|| '');
    const [descricao, setDescricao] = useState(props.ativo.descricao || '');
    const [modelo, setModelo] = useState(props.ativo.modelo || '');
    const [marca, setMarca] = useState(props.ativo.marca || '');
    const [preco_aquisicao, setPreco_aquisicao] = useState(props.ativo.preco_aquisicao || '');
    const [usuario, setUsuario] = useState(props.ativo.usuario || null);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(props.ativo.usuario || null);
    const [dataAquisicao, setDataAquisicao] = useState(new Date(props.ativo.dataAquisicao || '').toLocaleDateString('pt-BR'));
    const [dataExpiracaoEdit, setDataExpiracaoEdit] = useState('');
    const [dataExpiracao, setDataExpiracao] = useState(new Date(props.ativo.dataExpiracao || '').toLocaleDateString('pt-BR'));
    const [showAddFileButton, setShowAddFileButton] = useState(true);

    const { get, post, put, deletar } = useAxios();
    const { getCargo } = useAuth();

    const [arquivoBlob, setArquivoBlob] = useState<Blob | null>(null);

    useEffect(() => {
        buscarArquivos();
    }, []);

    const buscarArquivos = async () => {
        let buscador = new BuscadorArquivos();
        try {
            if(props.ativo.notaFiscal != null){
                const arquivo = await buscador.buscar();
                setArquivoBlob(arquivo);
                setNotaFiscal(arquivo);
            }
            console.log(arquivoBlob);
        } catch (error) {
            console.error('Erro ao buscar arquivos:', error);
        }
    };

    const manutencoesFuturas = props.ativo.manutencoes.filter(
        (manutencao) => new Date(manutencao.data_inicio) > new Date()
    );

    useEffect(() => {
        get('/usuario/listar/ativados')
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


    const isEditable = getCargo() === "Administrador";

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
        setPreco_aquisicao(inputValue);
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

        if (new Date(dataExpiracaoEdit.split('/').reverse().join('-')) < new Date(dataAquisicao.split('/').reverse().join('-'))) {
            Swal.fire({
                icon: 'error',
                title: 'Erro de data',
                text: 'A data de expiração não pode ser anterior à data de aquisição.',
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
            status: { id: statusId },
            codigoNotaFiscal: codigoNotaFiscal
        };

        put(`/atualizar/ativos/${props.ativo.id}`, ativosDto)
            .then(response => {
                if (statusId === 3 && props.ativo.usuario?.id !== usuarioSelecionado?.id) {
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
                                    window.location.reload();
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

    const excluirNotaFiscal = () => {
        const idAtivo = props.ativo.id;

        Swal.fire({
            title: 'Deseja excluir a nota fiscal?',
            text: 'Esta ação não pode ser desfeita!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deletar(`/ativos/excluir/nota-fiscal/${idAtivo}`).then(() => {
                    setNotaFiscal(null);
                    setCodigoNotaFiscal('');
                    setArquivoBlob(null);
                    setShowAddFileButton(true);
                    Swal.fire(
                        'Excluída!',
                        'A nota fiscal foi excluída.',
                        'success'
                    );
                }).catch((error) => {
                    console.error('Erro ao excluir nota fiscal:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro ao excluir nota fiscal',
                        text: 'Ocorreu um erro ao tentar excluir a nota fiscal. Por favor, tente novamente.'
                    });
                });
            }
        });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNotaFiscal(file);
            handleSaveNotaFiscal(file);
            setShowAddFileButton(false);
        } else {
            setNotaFiscal(null);
        }
    };

    const handleSaveNotaFiscal = (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const idAtivo = props.ativo.id;
        post(`/cadastrar/nota-fiscal/${idAtivo}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
            .then(response => {
                setNotaFiscal(response.data);
            })
            .catch(error => {
                console.error('Erro ao salvar nota fiscal:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao salvar nota fiscal',
                    text: 'Ocorreu um erro ao tentar salvar a nota fiscal. Por favor, tente novamente.'
                });
            });
    };

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
                        <li key={index}>
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
                        {getCargo() === "Administrador" ?
                            <ButtonMain
                                icon={<FaRegEdit style={{ fontSize: 30 }} />}
                                onClick={toggleEditing}
                            /> : ''}
                    </div>
                    {isEditing && props.ativo.status.id !== 2 ? <>
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

                    <div className={styles.informacoesNotaFiscal}>
                        <strong>Nota Fiscal:</strong>
                        {arquivoBlob === null ? (
                            <div>
                                {!isEditing ? (<p>Nenhuma nota fiscal cadastrada</p>) : ('')}
                                {isEditing && (
                                    <input type="file" onChange={handleFileChange} required accept="application/pdf, application/xml" />
                                )}
                            </div>
                        ) : (
                            <div className={styles.notaFiscal}>
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={`http://localhost:8080/ativos/nota-fiscal/${props.ativo.notaFiscal?.id}`}
                                >
                                    {props.ativo.notaFiscal?.nome}
                                </a>
                                {isEditing && (
                                    <button onClick={excluirNotaFiscal}><TbTrash size={25} /></button>                                
                                )}
                                {isEditing && !props.ativo.notaFiscal && (
                                    <input type="file" onChange={handleFileChange} />
                                )}
                            </div>
                        )}
                    </div>
                    <div className={styles.informacoes}>
                        <div>
                            <strong>Código Nota Fiscal: </strong>
                            {isEditing ? (
                                <input type="text" value={codigoNotaFiscal} onChange={(e) => setCodigoNotaFiscal(e.target.value)} />
                            ) : (
                                props.ativo.codigo_nota_fiscal
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
                    {getCargo() === "Administrador" ?
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