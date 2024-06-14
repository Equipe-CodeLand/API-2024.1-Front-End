import { useState } from "react";
import { Modal } from "react-bootstrap";
import styles from "../styles/modalUsuario.module.css";
import { IModalUsuario } from "../interfaces/modalUsuario";
import { useAxios } from "../hooks/useAxios";
import Swal from 'sweetalert2';
import Select from 'react-select';
import { FaRegEdit } from 'react-icons/fa';
import { useAuth } from "../hooks/useAuth";

export default function ModalUsuario(props: IModalUsuario) {
    const { usuario, logout } = useAuth(); 
    const [nome, setNome] = useState(props.usuario.nome);
    const [cpf, setCpf] = useState(props.usuario.cpf);
    const [email, setEmail] = useState(props.usuario.email);
    const [cargo, setCargo] = useState(props.usuario.cargo);
    const [ativos, setAtivos] = useState(props.usuario.ativos);
    const [isEditing, setIsEditing] = useState(false);
    const { put, deletar } = useAxios();
    const cpfAntigo = props.usuario.cpf;

    const [errors, setErrors] = useState({
        nome: '',
        cpf: '',
        email: ''
    });

    const validateFields = () => {
        const newErrors: any = {};
        if (!nome) newErrors.nome = "Preencha o campo obrigatório acima";
        if (!cpf) newErrors.cpf = "Preencha o campo obrigatório acima";
        if (!email) newErrors.email = "Preencha o campo obrigatório acima";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleChangeNome = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNome(event.target.value);
    };

    const handleChangeCpf = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCpf(event.target.value);
    };

    const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleChangeCargo = (selectedOption: any) => {
        if (selectedOption) {
            setCargo(selectedOption.value); 
        } else {
            setCargo('');
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
        if (!validateFields()) return;

        let cargoUsuario;

        if (cargo === 'Funcionário') {
            cargoUsuario = 2
        } else if (cargo === "Administrador") {
            cargoUsuario = 1
        }

        const usuarioAtualizado = {
            nome: nome,
            cpf: cpf,
            cargo: cargoUsuario,
            email: email
        };

        put(`/usuario/atualizar/usuario/${props.usuario.id}`, usuarioAtualizado)
            .then(() => {
                Swal.fire({
                    title: 'Usuário Atualizado!',
                    text: `O usuário foi atualizado com sucesso!`,
                    icon: 'success',
                    confirmButtonText: 'OK!'
                }).then(() => {
                    if (cpfAntigo === usuario?.cpf && cpf !== cpfAntigo) {
                        logout()
                    } else {
                        props.handleClose();
                        props.buscarUsuarios();
                    }
                });
            })
            .catch(error => {
                Swal.fire({
                    title: 'Erro!',
                    text: `${error.response.data}`,
                    icon: 'error',
                    confirmButtonText: 'OK'
                  });
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
                    <div className={styles.titulo}>
                        <h3>{isEditing ? <input type="text" value={nome} onChange={handleChangeNome} /> : nome}</h3>
                        {errors.nome && <span className={styles.error}>{errors.nome}</span>}
                        <FaRegEdit className="icone-edicao" onClick={() => setIsEditing(!isEditing)} style={{ width: 'auto', height: '30px', marginLeft: '10px' }} />
                    </div>
                    <div className={styles.informacoes}><strong>Status: </strong>{
                        props.usuario.estaAtivo ? "Ativo" : "Inativo"
                    }</div>
                    <div className={isEditing ? styles.informacoesEdicao : styles.informacoes}>
                        <strong>CPF: </strong> 
                        {isEditing ? <input type="text" value={cpf} onChange={handleChangeCpf} /> : cpf}
                        {errors.cpf && <span className={styles.error}>{errors.cpf}</span>}
                    </div>
                    <div className={isEditing ? styles.informacoesEdicao : styles.informacoes}>
                        <strong>Email: </strong>
                        {isEditing ? <input type="text" value={email} onChange={handleChangeEmail} /> : email}
                        {errors.email && <span className={styles.error}>{errors.email}</span>}
                    </div>
                    <div className={styles.informacoes}>
                        {(isEditing && usuario?.cpf !== cpfAntigo) && (
                            <label>
                                <strong>Cargo: </strong>
                                <Select
                                    options={[
                                        { value: 'Funcionário', label: 'Funcionário' },
                                        { value: 'Administrador', label: 'Administrador' }
                                    ]}
                                    value={{ value: cargo, label: cargo }}
                                    onChange={handleChangeCargo}
                                    placeholder="Selecione um cargo"
                                    styles={{ control: (provided) => ({ ...provided, borderRadius: '30px' })}}
                                />
                            </label>
                        )}
                        {(!isEditing || usuario?.cpf === cpfAntigo) && (
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
                            props.usuario.estaAtivo ? <button className={`${styles['btn-inativar']}`} onClick={() => mudarStatusUsuário('inativar')}>INATIVAR USUÁRIO</button> :
                                <button className={`${styles['btn-ativar']}`} onClick={() => mudarStatusUsuário('ativar')}>ATIVAR USUÁRIO</button>
                        }
                        {isEditing && (
                            <button className={`${styles['btn-salvar']}`} onClick={handleSave}>SALVAR ALTERAÇÕES</button>
                        )}
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )

}
