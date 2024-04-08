import styles from "../styles/ativosPage.module.css"
import Ativo from "./ativo.component";
import { AtivoType } from "../types/ativo.type";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AtivosPage() {
    const [data, setData] = useState<Array<AtivoType>>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | unknown>(null)   

    useEffect(() => {
        const fetchData = async () => {
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
        fetchData()
    }, [])

    var render
    if (data.length > 0) {
        console.log(data)
        render = 
        <div className={styles.listarAtivo}>
            { data.map((ativo, index) => {
                return <Ativo 
                    ativo={ativo}
                />
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
    );
}