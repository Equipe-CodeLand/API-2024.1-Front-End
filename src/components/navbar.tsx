import styles from "../styles/navbar.module.css";
import { useState } from "react";
import logo from "../images/logo-youtan-branco.png"
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import notificacaoLogo from "../images/notificacao.png";
import ModalNotificacao from "./modal-notificacao";

type Props = {
    local: string;
}

export default function Navbar(props: Props) {
    const [active, setMode] = useState(false);
    const { usuario, logout, getCargo } = useAuth();
    const [showModal, setShowModal] = useState<boolean>(false);
    const navigate = useNavigate();

    const teste = () => {
        localStorage.clear()
    }

    const toggleMode = () => {
        setMode(!active);
    }

    const handleLogout = () => {
        logout();
        localStorage.removeItem("notificacoes");
        navigate('/');
    }

    return (
        <>
            {showModal && (
                <ModalNotificacao
                    handleClose={() => setShowModal(false)}
                />
            )}
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <Link to="/home">
                        <img src={logo} alt="logo Youtan" />
                    </Link>
                </div>
                {usuario ? (
                    <>
                        <div className={styles.nav}>
                            <ul>
                                <li><Link className={(props.local === "ativos") ? styles.mark : ""} to="/ativos">Ativos</Link></li>
                                {getCargo() === "Administrador" && (
                                    <>
                                        <li><Link className={(props.local === "manutencao") ? styles.mark : ""} to="/manutencao">Manutenções</Link></li>
                                        <li><Link className={(props.local === "usuarios") ? styles.mark : ""} to="/usuarios">Usuarios</Link></li>
                                    </>
                                )}
                                <div className={styles.separacao}></div>
                                <li>
                                    <img
                                        src={notificacaoLogo}
                                        alt="Sino de Notificação"
                                        className={styles.notificacao}
                                        onClick={() => setShowModal(true)}
                                    />
                                </li>
                                <div className={styles.separacao}></div>
                                <li className={styles.logout} onClick={handleLogout}>Sair</li> {/* Utiliza handleLogout */}
                            </ul>
                        </div>
                        <div className={!active ? styles.open : styles.closed}>
                            <div className={styles.background} onClick={toggleMode}></div>
                            <div className={styles.hamburguer} >
                                <div onClick={toggleMode}></div>
                            </div>
                            <div className={styles.menu}>
                                <ul>
                                    <li><Link className={(props.local === "ativos") ? styles.mark : ""} to="/ativos">Ativos</Link></li>
                                    {getCargo() === "Administrador" && (
                                        <>
                                            <li><Link className={(props.local === "manutencao") ? styles.mark : ""} to="/manutencao">Manutenções</Link></li>
                                            <li><Link className={(props.local === "usuarios") ? styles.mark : ""} to="/usuarios">Usuarios</Link></li>
                                        </>
                                    )}
                                    <div className={styles.separacao_horizontal}></div>
                                    <li className={styles.notificacoes} onClick={() => setShowModal(true)}>Histórico de Notificações</li>
                                    <li className={styles.logout} onClick={handleLogout}>Sair</li> {/* Utiliza handleLogout */}
                                </ul>
                            </div>
                        </div>
                    </>
                ) : ''}
            </nav>
        </>
    );
}