import styles from "../styles/navbar.module.css";
import { useState } from "react";
import logo from "../images/logo-youtan-branco.png"
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

type props = {
    local: string;
}

export default function Navbar(props: props) {
    const [active, setMode] = useState(false);
    const {usuario, logout, getCargo} = useAuth()
    const toggleMode = () => {
        setMode(!active);
        if (active) {
            console.log(props.local)   
        }
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link to="/">
                    <img src={logo} alt="logo Youtan" />    
                </Link>
            </div>
            { usuario ? <>
                <div className={styles.nav}>
                    <ul>
                        <li><Link className={(props.local === "ativos") ? styles.mark : ""} to="/ativos">Ativos</Link></li>
                        { getCargo() === "Administrador" ? <>
                            <li><Link className={(props.local === "manutencao") ? styles.mark : ""} to="/manutencao">Manutenções</Link></li> 
                            <li><Link className={(props.local === "usuarios") ? styles.mark : ""} to="/usuarios">Usuarios</Link></li>
                        </> : '' }    
                        <li className={styles.logout} onClick={logout} >Sair</li>
                    </ul>
                </div>
                <div className={!active ? styles.open : styles.closed }>
                    <div className={styles.background} onClick={toggleMode}></div>
                    <div className={styles.hamburguer} >
                        <div onClick={toggleMode}></div>
                    </div>
                    <div className={styles.menu}>
                        <ul>
                            <li><Link className={(props.local === "ativos") ? styles.mark : ""} to="/ativos">Ativos</Link></li>
                            { getCargo() === "Administrador" ? <>
                                <li><Link className={(props.local === "manutencao") ? styles.mark : ""} to="/manutencao">Manutenções</Link></li> 
                                <li><Link className={(props.local === "usuarios") ? styles.mark : ""} to="/usuarios">Usuarios</Link></li>
                            </> : '' }    
                            <li className={styles.logout} onClick={logout}>Sair</li>
                        </ul>
                    </div>
                </div>
            </> : ''}
        </nav>
    );
}