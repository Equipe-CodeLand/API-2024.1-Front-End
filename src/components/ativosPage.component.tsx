import styles from "../styles/ativosPage.module.css"
import Ativo from "./ativo.component";

const ativos = [
    {id: 1, nome: "Maquina de Impressão 3D Industrial", disponibilidade: "1"},
    {id: 2, nome: "Maquina de Impressão 3D Industrial", disponibilidade: "2"},
    {id: 3, nome: "Maquina de Impressão 3D Industrial", disponibilidade: "3"},
]

export default function AtivosPage() {
    return (
        <div className={styles.body}>
            <div className={styles.filtro}></div>
            <div className={styles.conteudo}>
                <main>
                    <div className={styles.adicionarAtivo}></div>
                    <div className={styles.listarAtivo}>
                        {
                            ativos.map(ativo => {
                                return <Ativo
                                    id={ativo.id}
                                    nome={ativo.nome}
                                    disponibilidade={ativo.disponibilidade}
                                />
                            })
                        }
                    </div>
                </main>
            </div>
        </div>
    );
}