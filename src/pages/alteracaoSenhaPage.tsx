import { useContext, useEffect, useState } from "react"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import styles from '../styles/alteracaoSenha.module.css'
import { useAxios } from "../hooks/useAxios"
import Swal from "sweetalert2"
import { AuthContext } from "../context/authContext"

export default function AlteracaoSenhaPage(){
    const { usuario } = useContext(AuthContext);
    const [novaSenha, setNovaSenha] = useState('');
    const [cpf, setCpf] = useState('');
    const [ erro ] = useState(false);
    const { put } = useAxios();

    const alterarSenha = async () => {
        const cpfFormatado = cpf.replace(/\D/g, ''); 

        try {
            if(usuario){
                const cpfUsuario = usuario ? usuario.cpf : cpfFormatado;
                const response = await put(`/credencial/${cpfUsuario}/senha`, { novaSenha });
                if (response.status === 200) {
                    Swal.fire({
                        title: 'Senha alterada!',
                        text: 'A nova senha foi alterada com sucesso!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    throw new Error('Erro ao alterar senha');
                }
                window.location.reload();
            } else{
                const response = await put(`/credencial/${cpfFormatado}/senha`, { novaSenha });
                if (response.status === 200) {
                    Swal.fire({
                        title: 'Senha alterada!',
                        text: 'A nova senha foi alterada com sucesso!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    throw new Error('Erro ao alterar senha');
                }
                window.location.reload();
            }
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao alterar senha!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    useEffect(() => {
        if (!usuario) {
        }
    }, [usuario]); 

    return (
        <>
            {usuario && (
                <>
                    <Navbar local={""} />
                    <div className={styles.container}>
                        <h1>Alteração de Senha</h1>
                        {erro ? <div className={styles.erro}>CPF ou senha incorretos</div> : ""}
                        <div className={styles.camposInput}>
                            <div>
                                <label>Nova Senha:</label>
                                <input type="password" placeholder="Digite a nova senha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                            </div>
                        </div>
                        <button className={styles.submit} type="submit" onClick={alterarSenha}>Alterar Senha</button>
                    </div>
                    <Footer />
                </>
            )}
            {!usuario && (
                <>
                    <Navbar local={""} />
                    <div className={styles.container}>
                        <h1>Alteração de Senha</h1>
                        {erro ? <div className={styles.erro}>CPF ou senha incorretos</div> : ""}
                        <div className={styles.camposInput}>
                            <div>
                                <label>Digite o seu CPF:</label>
                                <input type="text" placeholder="123456789101" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                            </div>
                            <div>
                                <label>Nova Senha:</label>
                                <input type="password" placeholder="Digite a nova senha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                            </div>
                        </div>
                        <button className={styles.submit} type="submit" onClick={alterarSenha}>Alterar Senha</button>
                    </div>
                    <Footer />
                </>
            )}
        </>
    )
}