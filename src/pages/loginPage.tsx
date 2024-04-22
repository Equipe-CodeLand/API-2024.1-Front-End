import { useContext, useState } from "react"
import logo from "../images/logo-youtan.png"
import styles from '../styles/login.module.css'
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface JwtPayload {
    sub: string
    cargo: string
}

export default function LoginPage() {
    const { login } = useAuth();
    const [cpf, setCpf] = useState('')
    const [senha, setSenha] = useState('')
    const navigate = useNavigate();
    
    const handleLogin = () => {
        axios.post(`http://localhost:8080/login`, {cpf, senha})
        .then(res => {
            const data = res.data
            axios.defaults.headers.common["Authorization"] = "Bearer " + data.token;
            const decoded = jwtDecode<JwtPayload>(data.token);
            login({
                sub: decoded.sub,
                cargo: decoded.cargo
            })
        })
        .catch(err => {
            console.log(err)
        }) 
        navigate("/home", { replace: true });
    }

    return(
        <div className={styles.login}>
            <div>
                <img className={styles.logo} src={logo} alt="logo-youtan" />
            </div>
            <div>
                <input className={styles.username} placeholder="CPF" onChange={e => setCpf(e.target.value)}/>
                <input className={styles.password} type="password" placeholder="Senha" onChange={e => setSenha(e.target.value)}/>
                <button className={styles.btn_login} onClick={handleLogin}>Entrar</button>
            </div>
        </div>
    )
}