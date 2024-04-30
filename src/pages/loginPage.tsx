import { Component, useState } from "react"
import logo from "../images/logo-youtan.png"
import styles from '../styles/login.module.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage(){  
        
        const [cpf, setcpf] = useState('')
        const [senha, setSenha] = useState('')
    
        const [active, setMode] = useState(true);
    
        const [errorLogin, setErrorLogin] = useState(false);
        const [errorPassword, setErrorPassword] = useState(false);
        const [errorType, setErrorType] = useState(false)
    
        var [loginErrorText, setLoginErrorText] = useState("")
        var [passwordErrorText, setPasswordErrorText] = useState("")
        var [typeErrorText, setTypeErrorText] = useState("")
    
        const navigate = useNavigate()
    
        function usuarioExistente(cpf:string, senha:string) {
            
            axios.post('http://localhost:8080/login', {
                cpf: cpf,
                senha: senha,
            })
            .then(res => {
                const token = res.data.token; 
                if(token == "Acesso negado"){
                    alert('CPF ou senha incorretos');
                }
                else{        
                    localStorage.setItem('token', token);
                    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                    
                    navigate('/home')
                }
            })
            .catch(error => {
                    console.log(error);
            });
        }
    
        function loginError(mensagem:string) {
            setErrorLogin(true)
            setErrorPassword(false)
            setErrorType(false)
            setLoginErrorText(mensagem)
            setPasswordErrorText("")
            setTypeErrorText("")
        }
    
        function passwordError(mensagem:string) {
            setErrorLogin(false)
            setErrorPassword(true)
            setErrorType(false)
            setLoginErrorText("")
            setPasswordErrorText(mensagem)
            setTypeErrorText("")
        }
    
        function allSucess() {
            setErrorLogin(false)
            setErrorPassword(false)
            setLoginErrorText("")
            setPasswordErrorText("")
        }
        
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            
            if (cpf === "") {
                loginError("Insira um cpf")
            } else if (senha === "") {
                passwordError("Insira uma senha")
            }
            else {
                allSucess()
                usuarioExistente(cpf, senha)
            }
        }
        
        const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newcpf = e.target.value;
            setcpf(newcpf);
        }
        
        const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newSenha = e.target.value;
            setSenha(newSenha);
        }
    
        return(
            <>
            <form onSubmit={handleSubmit} className={styles.login}>
                <div>
                    <img className={styles.logo} src={logo} alt="logo-youtan" />
                </div>
                <div>
                    <input value={cpf} type="cpf" id="inputLogin" className={styles.username} placeholder="CPF" onChange={handleCpfChange} />
                    <div className="errorText">{loginErrorText}</div>

                    <input value={senha} type="password" id="inputPassword" className={styles.password} placeholder="Senha" onChange={handleSenhaChange}/>
                    <div className="errorText errorPassword">{passwordErrorText}</div>

                    <button className={styles.btn_login}>Entrar</button>
                </div>
            </form>
            </>
        )
}