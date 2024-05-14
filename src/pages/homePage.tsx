import Footer from "../components/footer";
import { TbZoomMoney } from "react-icons/tb";
import { GoPeople } from "react-icons/go";
import { VscTools } from "react-icons/vsc";
import styles from "../styles/home.module.css";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { getCargo } = useAuth()

  return (
    <div>
      <Navbar local="home" />
      <div className={styles.div}>
        <div className={styles.container}>
          <h1 className={styles.tituloHome}>Bem-vindo à nossa Plataforma de Gestão de Ativos!</h1>
          <div className={styles.sobreHome}>
            <p>
              Gerencie seus ativos, visualize informações detalhadas, verifique suas manutenções e muito mais com o nosso site.
            </p>
            <p style={{textAlign: 'center'}}>              
              Para começar escolha uma das opções abaixo:
            </p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.button}>
            <Link to="/ativos" className={styles.ativos} style={{ flexDirection: 'column' }}>
              <TbZoomMoney size="38" strokeWidth="1.5" />
              <span>Ativos</span>
            </Link>
            { getCargo() === "Funcionário" ? 
              <Link to="/alteracao/senha" className={styles.usuarios} style={{ flexDirection: 'column' }}>
                <GoPeople size="38" />
                <span>Alterar Senha</span>
              </Link> : ''
            }
            { getCargo() === "Administrador" ? <>
              <Link to="/manutencao" className={styles.manutencoes} style={{ flexDirection: 'column' }}>
                <VscTools size="38" />
                <span>Manutenções</span>
              </Link>
              <Link to="/usuarios" className={styles.usuarios} style={{ flexDirection: 'column' }}>
                <GoPeople size="38" />
                <span>Usuários</span>
              </Link> </> : ''
            }
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}