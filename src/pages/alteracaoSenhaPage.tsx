import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import styles from '../styles/alteracaoSenha.module.css';
import { useAxios } from "../hooks/useAxios";
import Swal from "sweetalert2";
import { AuthContext } from "../context/authContext";

export default function AlteracaoSenhaPage() {
    const { usuario } = useContext(AuthContext);
    const [novaSenha, setNovaSenha] = useState('');
    const [cpf, setCpf] = useState('');
    const [modoVerificacao, setModoVerificacao] = useState(false);
    const [codigoVerificacao, setCodigoVerificacao] = useState('');
    const [erro, setErro] = useState(false);
    const { put, get } = useAxios();

    const limparCampos = () => {
        setNovaSenha('');
        setCpf('');
        setModoVerificacao(false);
        setCodigoVerificacao('');
    };

    const verificacaoSenhaIgual = async() => {
        const cpfFormatado = cpf.replace(/\D/g, ''); 
        const cpfUsuario = usuario ? usuario.cpf : cpfFormatado;
        try {
            const response = await get(`/credencial/${cpfUsuario}/verificar-senha?senha=${novaSenha}`);
            if (response.status === 200 && response.data) {
                Swal.fire({
                    title: 'Nova senha igual à senha antiga!',
                    text: 'A nova senha é a mesma que a senha atual, por favor, digite uma nova senha!',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                limparCampos();
                return true;
            } else {
                await enviarEmailVerificacao();
                console.log(response)
                return false;
            }
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao verificar a senha!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            console.log(error)
            return true;
        }
    };

    const alterarSenha = async () => {
        const cpfFormatado = cpf.replace(/\D/g, ''); 
        try {
            const cpfUsuario = usuario ? usuario.cpf : cpfFormatado;
            const response = await put(`/credencial/${cpfUsuario}/senha/${codigoVerificacao}`, { novaSenha });
            if (response.status === 200) {
                Swal.fire({
                    title: 'Senha alterada!',
                    text: 'A nova senha foi alterada com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                limparCampos();
            } else {
                throw new Error('Erro ao alterar senha');
            }
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao alterar senha!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const enviarEmailVerificacao = async () => {
        const cpfFormatado = cpf.replace(/\D/g, ''); 

        try {
            const cpfUsuario = usuario ? usuario.cpf : cpfFormatado;
            const response = await put(`/credencial/${cpfUsuario}/senha`, { novaSenha });
            if (response.status === 200) {
                setModoVerificacao(true);
            } else {
                throw new Error('Erro ao enviar o email de verificação');
            }
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao enviar o email de verificação!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    useEffect(() => {
        if (!usuario) {
            setCpf('');
        }
    }, [usuario]);

    return (
        <>
            <Navbar local={""} />
            <div className={styles.container}>
                <h1>Alteração de Senha</h1>
                {erro ? <div className={styles.erro}>CPF ou senha incorretos</div> : ""}
                {!modoVerificacao && (
                    <div className={styles.camposInput}>
                        <div>
                            <label>{usuario ? "Nova Senha:" : "Digite o seu CPF:"}</label>
                            {!usuario && (
                                <input type="text" placeholder="123456789101" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                            )}
                            <input type="password" placeholder="Digite a nova senha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                        </div>
                    </div>
                )}
                {modoVerificacao && (
                    <div className={styles.camposInput}>
                        <div>
                            <label>Código de Verificação:</label>
                            <input type="text" placeholder="Digite o código de verificação" value={codigoVerificacao} onChange={(e) => setCodigoVerificacao(e.target.value)} />
                        </div>
                    </div>
                )}
                {!modoVerificacao ? (
                    <button className={styles.submit} type="submit" onClick={verificacaoSenhaIgual}>Enviar email de verificação</button>
                ) : (
                    <button className={styles.submit} type="submit" onClick={alterarSenha}>Enviar</button>
                )}
            </div>
            <Footer />
        </>
    );
}