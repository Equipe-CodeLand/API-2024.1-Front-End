import styles from "../styles/navbar.module.css";
import { useState } from "react";
import logo from "../images/logo-youtan-branco.png"
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

type Props = {
    local: string;
}

export default function Navbar(props: Props) {
    const [active, setMode] = useState(false);
    const { usuario, logout, getCargo } = useAuth();
    const navigate = useNavigate(); 

    const toggleMode = () => {
        setMode(!active);
        if (active) {
            console.log(props.local)   
        }
    }

    const handleLogout = () => {
        logout(); 
        navigate('/'); 
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link to="/home">
                    <img src={logo} alt="logo Youtan" />    
                </Link>
            </div>
            { usuario ? (
                <>
                    <div className={styles.nav}>
                        <ul>
                            <li><Link className={(props.local === "ativos") ? styles.mark : ""} to="/ativos">Ativos</Link></li>
                            { getCargo() === "Administrador" && (
                                <>
                                    <li><Link className={(props.local === "manutencao") ? styles.mark : ""} to="/manutencao">Manutenções</Link></li> 
                                    <li><Link className={(props.local === "usuarios") ? styles.mark : ""} to="/usuarios">Usuarios</Link></li>
                                </>
                            )}
                            <li className={styles.logout} onClick={handleLogout}>Sair</li> {/* Utiliza handleLogout */}
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
                                { getCargo() === "Administrador" && (
                                    <>
                                        <li><Link className={(props.local === "manutencao") ? styles.mark : ""} to="/manutencao">Manutenções</Link></li> 
                                        <li><Link className={(props.local === "usuarios") ? styles.mark : ""} to="/usuarios">Usuarios</Link></li>
                                    </>
                                )}
                                <li className={styles.logout} onClick={handleLogout}>Sair</li> {/* Utiliza handleLogout */}
                            </ul>
                        </div>
                    </div>
                </>
            ) : ''}
        </nav>
    );
}
