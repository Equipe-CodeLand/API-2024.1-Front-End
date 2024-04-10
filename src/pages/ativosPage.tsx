import Ativo from "../components/ativo";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import styles from "../styles/ativosPage.module.css"
import { AtivoType } from "../types/ativo.type";
import { useEffect, useState } from "react";
import { Manutencao } from "../types/manutencao.type";

export default function AtivosPage() {
    const [data, setData] = useState<Array<AtivoType>>([])
    const [manutencoes, setManutencoes] = useState<Array<any>>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | unknown>(null)

    const ativos = async () => {
        try {
            const response = await fetch("http://localhost:8080/listar/ativos")
            if (!response.ok) {
                throw new Error("Erro ao buscar ativos")
            }
            const jsonData = await response.json()
            setData(jsonData)
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {

        const manutencoes = async () => {
            try {
                const response = await fetch("http://localhost:8080/manutencao")
                if (!response.ok) {
                    throw new Error("Erro ao buscar manutenções")
                }
                const manutencoes = await response.json()
                setManutencoes(manutencoes)
            } catch (error) {
                console.log(error)
            }
        }

        ativos()
        manutencoes()
    }, [])

    var render
    if (loading) {
        render =
            <div className={styles.listarAtivo}>
                <span className={styles.semAtivos}>
                    Carregando ativos...
                </span>
            </div>
    } else if (error) {
        render =
            <div className={styles.listarAtivo}>
                <span className={styles.semAtivos}>
                    Erro ao carregar ativos! <br />
                    :(
                </span>
            </div>
    } else if (data.length > 0) {
        render =
            <div className={styles.listarAtivo}>
                {data.map((ativo, index) => {
                    return <Ativo
                        id={ativo.id}
                        nome={ativo.nome}
                        descricao={ativo.descricao}
                        marca={ativo.marca}
                        modelo={ativo.modelo}
                        preco_aquisicao={ativo.preco_aquisicao}
                        funcionario={ativo.funcionario}
                        setor={ativo.setor}
                        status={ativo.status}
                        dataAquisicao={ativo.dataAquisicao}
                        dataExpiracao={ativo.dataExpiracao}
                        manutencoes={manutencoes.filter(manut => manut.ativos.id === ativo.id)}
                        buscarAtivos={ativos}
                        key={ativo.id}
                    />
                })}
            </div>
    } else {
        render =
            <div className={styles.listarAtivo}>
                <span className={styles.semAtivos}>
                    Nenhum ativo encontrado! <br />
                    :/
                </span>
            </div>
    }
    return (
        <div>
            <Navbar local="ativos" />
            <div className={styles.body}>
                <div className={styles.filtro}></div>
                <div className={styles.conteudo}>
                    <main>
                        <div className={styles.adicionarAtivo}>
                            <a className={styles.botao} href="/cadastrar/ativos">
                                Adicionar Ativo
                            </a>
                        </div>
                        <div className={styles.listarAtivo}>
                            {render}
                        </div>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
}