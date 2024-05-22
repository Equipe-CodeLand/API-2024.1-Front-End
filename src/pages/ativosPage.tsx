/* eslint-disable react-hooks/exhaustive-deps */
import Ativo from "../components/ativo";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import styles from "../styles/ativosPage.module.css"
import { IAtivo } from "../interfaces/ativo";
import { useEffect, useState } from "react";
import { useAxios } from "../hooks/useAxios";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function AtivosPage() {
    const [data, setData] = useState<Array<IAtivo>>([])
    const [manutencoes, setManutencoes] = useState<Array<any>>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | unknown>(null)
    const { get } = useAxios()
    const { getCargo, getSub } = useAuth()

    const ativos = async () => {
        
        const rota = getCargo() === "Funcionário" ? `/listar/ativos/${getSub()}` : "/listar/ativos";
        get(rota)
            .then(response => {
                setData(response.data)
                setLoading(false)
            })
            .catch(error => {
                setError(error)
                setLoading(false)
            })
    }
    const chamarManutencoes = async () => {
        get("/manutencao")
            .then(response => {
                setManutencoes(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        ativos()
        chamarManutencoes()
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
                    const isFuncionario = getCargo() === "Funcionário";
                    return <Ativo
                        id={ativo.id}
                        nome={ativo.nome}
                        notaFiscal={ativo.notaFiscal}
                        descricao={ativo.descricao}
                        marca={ativo.marca}
                        modelo={ativo.modelo}
                        preco_aquisicao={ativo.preco_aquisicao}
                        usuario={ativo.usuario}
                        setor={ativo.setor}
                        status={ativo.status}
                        dataAquisicao={ativo.dataAquisicao}
                        dataExpiracao={ativo.dataExpiracao}
                        manutencoes={manutencoes.filter(manut => manut.ativos.id === ativo.id)}
                        buscarAtivos={ativos}
                        key={ativo.id}
                        isEditable={!isFuncionario}
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
                        { getCargo() === "Administrador" ? 
                                <Link className={styles.botao} to="/cadastrar/ativos">
                                    Adicionar Ativo
                                </Link> : '' }
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