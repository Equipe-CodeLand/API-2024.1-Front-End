import { TbZoomMoney } from "react-icons/tb";
import { VscTools } from "react-icons/vsc";
import styles from "../styles/home.module.css";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className={styles.div}>
            <div className={styles.container}>
                <h1 className={styles.tituloHome}>Bem-vindo à nossa Plataforma de Gestão de Ativos!</h1>
                <p className={styles.sobreHome}>
                    Gerencie seus ativos, visualize informações detalhadas, verifique suas manutenções e muito mais com o nosso site. 
                </p>
                <p className={styles.sobreHome}>
                    Para começar escolha uma das opções abaixo:
                </p>
            </div>
            <div className={styles.content}>
                <div className={styles.button}>
                    <Link to="/ativos" className={styles.ativos} style={{flexDirection: 'column'}}>
                        <TbZoomMoney size="38" strokeWidth="1.5" />
                        <span>Ativos</span>
                    </Link>
                    <Link to="/manutencao" className={styles.manutencoes} style={{flexDirection: 'column'}}>
                        <VscTools size="38" />
                        <span>Manutenções</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}