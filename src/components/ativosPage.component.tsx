import styles from "../styles/ativosPage.module.css"
import Ativo from "./ativo.component";

type tipoAtivo = {
    id: number;
    nome: string;
    disponibilidade: string;
}

export default function AtivosPage() {
    const listaAtivos:Array<tipoAtivo> = [

    ]

    var render
    if (listaAtivos.length > 0) {
        render = 
        <div className={styles.listarAtivo}>
            { listaAtivos.map((ativo, index) => {
                return <Ativo id={ativo.id} nome={ativo.nome} disponibilidade={ativo.disponibilidade}/>
            })}
        </div>
    } else {
        render =
        <div className={styles.listarAtivo}>
            <span className={styles.semAtivos}>
                Nenhum ativo encontrado! <br/>
                :/ 
            </span>
        </div>
    }

    return (
        <div className={styles.body}>
            <div className={styles.filtro}></div>
            <div className={styles.conteudo}>
                <main>
                    <div className={styles.adicionarAtivo}>
                        <button className={styles.botao}>
                            Adicionar Ativo
                        </button>
                    </div>
                    { render }
                </main>
            </div>
        </div>
    );
}