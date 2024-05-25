import { useState } from "react";
import { Modal } from "react-bootstrap";
import styles from "../styles/modalUsuario.module.css";
import { IModalUsuario } from "../interfaces/modalUsuario";
import { useAxios } from "../hooks/useAxios";
import Swal from 'sweetalert2';
import Select from 'react-select';
import { FaRegEdit } from 'react-icons/fa'; // Ícone de edição

export default function ModalUsuario(props: IModalUsuario) {
    const [nome, setNome] = useState(props.usuario.nome);
    const [cpf, setCpf] = useState(props.usuario.cpf);
    const [cargo, setCargo] = useState(props.usuario.cargo);
    const [ativos, setAtivos] = useState(props.usuario.ativos);
    const [isEditing, setIsEditing] = useState(false);
    const { put, deletar } = useAxios();

    const handleChangeNome = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNome(event.target.value);
    };

    const handleChangeCpf = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCpf(event.target.value);
    };

    const handleChangeCargo = (selectedOption: any) => {
        if (selectedOption) {
            setCargo(selectedOption.value); // Corrigido para armazenar apenas o valor do cargo
        } else {
            setCargo(''); // Limpar o cargo se nada for selecionado
        }
    };

    const mudarStatusUsuário = (opcao: string) => {
        put(`usuario/${props.usuario.id}/${opcao}`, {})
            .then(() => {
                Swal.fire({
                    title: 'Usuário Atualizado!',
                    text: `O usuário foi atualizado com sucesso!`,
                    icon: 'success',
                    confirmButtonText: 'OK!'
                });
                props.handleClose();
                props.buscarUsuarios();
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleSave = () => {

        let cargoUsuario;

        if (cargo === 'Funcionário') {
            cargoUsuario = 2
        } else if (cargo === "Administrador") {
            cargoUsuario = 1
        }

        const usuarioAtualizado = {
            nome: nome,
            cpf: cpf,
            cargo: cargoUsuario
        };

        put(`/usuario/atualizar/usuario/${props.usuario.id}`, usuarioAtualizado)
            .then(response => {
                Swal.fire({
                    title: 'Usuário Atualizado!',
                    text: `O usuário foi atualizado com sucesso!`,
                    icon: 'success',
                    confirmButtonText: 'OK!'
                });
                console.log('Dados atualizados com sucesso:', response.data);
                console.log(usuarioAtualizado);
                props.handleClose();
                props.buscarUsuarios(); // Se necessário buscar os usuários novamente após a atualização
            })
            .catch(error => {
                console.error('Erro ao atualizar os dados:', error);
            });
    };

    return (
        <>
            <Modal show={true} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <div className={styles.id}>
                        <h4>ID: {props.usuario.id}</h4>
                    </div>
                </Modal.Header>
                <Modal.Body className={styles.modal}>
                    {/* Campos editáveis */}
                    <div className={styles.titulo}>
                        <h3>{isEditing ? <input type="text" value={nome} onChange={handleChangeNome} /> : nome}</h3>
                        <FaRegEdit onClick={() => setIsEditing(!isEditing)} />
                    </div>
                    <div className={styles.informacoes}><strong>Status: </strong>{
                        props.usuario.estaAtivo ? "Ativo" : "Inativo"
                    }</div>
                    <div className={styles.informacoes}>
                        <strong>CPF: </strong>
                        {isEditing ? <input type="text" value={cpf} onChange={handleChangeCpf} /> : cpf}
                    </div>
                    <div className={styles.informacoes}>
                        {isEditing && ( // Renderizar o dropdown apenas se estiver editando
                            <label>
                                <strong>Cargo: </strong>
                                <Select
                                    options={[
                                        { value: 'Funcionário', label: 'Funcionário' },
                                        { value: 'Administrador', label: 'Administrador' }
                                    ]}
                                    value={{ value: cargo, label: cargo }} // Definir valor e rótulo do dropdown
                                    onChange={handleChangeCargo}
                                    placeholder="Selecione um cargo"
                                    styles={{ control: (provided) => ({ ...provided, borderRadius: '20px' }) }}
                                />
                            </label>
                        )}
                        {!isEditing && ( // Se não estiver editando, mostrar apenas o cargo
                            <div>
                                <strong>Cargo: </strong>
                                {cargo}
                            </div>
                        )}
                    </div>
                    <hr />
                    <div className={styles.ativos}>
                        <strong>Ativos: </strong>
                        {/* Lista de ativos */}
                        {ativos !== undefined && ativos.length > 0 ? (
                            <ul>
                                {ativos.map((ativo: any, index: any) => (
                                    <li key={index}>{ativo.id} - {ativo.nome}</li>
                                ))}
                            </ul>
                        ) : (
                            <div className={styles.semAtivos}>- Não há ativos associados -</div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className={styles.botoes}>
                        {
                            props.usuario.estaAtivo ? <button onClick={() => mudarStatusUsuário('inativar')}>INATIVAR USUÁRIO</button> :
                                <button onClick={() => mudarStatusUsuário('ativar')}>ATIVAR USUÁRIO</button>
                        }
                        {/* Botão de salvar e fechar */}
                        {isEditing && (
                            <button onClick={handleSave}>SALVAR</button>
                        )}
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )

}
