import { useState } from "react"
import logo from "../images/logo-youtan.png"
import styles from '../styles/login.module.css'
import { useAuth } from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useAxios } from "../hooks/useAxios";
import axios from "axios";

interface JwtPayload {
    sub: string
    cargo: string
}

export default function LoginPage() {
    const { login } = useAuth();
    const [cpf, setCpf] = useState('')
    const [senha, setSenha] = useState('')
    const navigate = useNavigate();
    const { post } = useAxios();
    const [erro, setErro] = useState(false)
    
    const handleLogin = () => {
        post(`/login`, {cpf, senha})
            .then(async res => {
                const data = res.data
                const decoded = jwtDecode<JwtPayload>(data.token);
                const cargo = await axios.get(`http://localhost:8080/usuario/${decoded.sub}/cargo`, {headers: {Authorization: `Bearer ${data.token}`}})
                login({
                    sub: decoded.sub,
                    cargo: cargo.data,
                    token: data.token,
                })
                navigate("/", { replace: true });
            })
            .catch(() => {
                setErro(true)
            }) 
    }

    return(
        <div className={styles.login}>
            <div>
                <img className={styles.logo} src={logo} alt="logo-youtan" />
            </div>
            <div>
                {erro ? <div className={styles.erro}>CPF ou senha incorretos</div> : ""}                
                <input className={styles.username} placeholder="CPF" onChange={e => setCpf(e.target.value)}/>
                <input className={styles.password} type="password" placeholder="Senha" onChange={e => setSenha(e.target.value)}/>
                <button className={styles.btn_login} onClick={handleLogin}>Entrar</button>
            </div>
        </div>
    )
}