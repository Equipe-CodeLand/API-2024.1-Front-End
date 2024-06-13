import { useEffect, useState } from "react";
import { useAxios } from "../hooks/useAxios";
import Dashboard from "../interfaces/dashboard";
import styles from "../styles/dashboard.module.css";
import { IAtivo } from "../interfaces/ativo";
import { log } from "console";


export default function DashboardRelatorios() {
    const [dados, setDados] = useState<Dashboard | undefined>(undefined);
    const [dataInicio, setDataInicio] = useState("");
    const [dataFinal, setDataFinal] = useState("");
    const { get, loading, setLoading } = useAxios();

    useEffect(() => {
        buscarDados();
    }, []);

    const buscarDados = async () => {
        try {
            let response = await get(`/dashboard/`);
            let data = response.data;

            const dashboardData = {
                ativos: data.ativos,
                qntManutencoes: data.qntManutencoes,
                valorPorStatus: data.valorPorStatus,
                ativosPorStatus: data.ativosPorStatus,
                ativosExpirando: data.ativosExpirando,
                valorTotal: 0
            }

            let valorTotal = 0
            const hoje = new Date();

            dashboardData.ativos.map((ativo: IAtivo) => {
                if (ativo.preco_aquisicao !== null) {
                    valorTotal += parseFloat(ativo.preco_aquisicao)
                }
            })

            dashboardData.valorTotal = valorTotal
            setDados(dashboardData);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao filtrar:", error);
        }
    }

    const filtrar = async () => {
        try {
            if (dataFinal !== "" && dataInicio !== "") {
                let response = await get(`/dashboard/${dataInicio}/${dataFinal}`);
                let data = response.data;

                const dashboardData = {
                    ativos: data.ativos,
                    qntManutencoes: data.qntManutencoes,
                    valorPorStatus: data.valorPorStatus,
                    ativosPorStatus: data.ativosPorStatus,
                    ativosExpirando: data.ativosExpirando,
                    valorTotal: 0
                }

                let valorTotal = 0

                dashboardData.ativos.map((ativo: IAtivo) => {
                    if (ativo.preco_aquisicao !== null) {
                        valorTotal += parseFloat(ativo.preco_aquisicao)
                    }
                })

                dashboardData.valorTotal = valorTotal
                setDados(dashboardData);
                setLoading(false);
            }
        } catch (error) {
            console.error("Erro ao filtrar:", error);
        }

    };

    return (
        <>
            <div className={styles.inputs}>
                <div>
                    <label>Data Início</label>
                    <input
                        type="date"
                        placeholder="Data Início"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                    />
                </div>
                <div>
                    <label>Data Final</label>
                    <input
                        type="date"
                        placeholder="Data Final"
                        value={dataFinal}
                        onChange={(e) => setDataFinal(e.target.value)}
                    />
                </div>
                <div className={styles.botao}>
                    <button onClick={buscarDados}>Limpar</button>
                    <button onClick={filtrar}>Aplicar</button>
                </div>
            </div>

            <div className={styles.container}>
                <a href="/ativos" className={styles.card}>
                    <p className={styles.containerTitulo}> Ativos da empresa</p>
                    <div className={styles.containerDados}>
                        <div className={styles.containerDadosTexto}>
                            <strong> Ativos </strong>
                            <p> {dados?.ativos.length}</p>
                        </div>
                        <div className={styles.containerDadosTexto}>
                            <strong> Valor total </strong>
                            <p>R$ {dados?.valorTotal.toFixed(2)}</p>
                        </div>
                    </div>
                </a>
                <a href="/manutencao" className={styles.card}>
                    <p className={styles.containerTitulo}> Manutenção nos próximos</p>
                    <div className={styles.containerDados}>
                        <div className={styles.containerDadosTexto}>
                            <strong> 15 Dias </strong>
                            <p> {dados?.qntManutencoes[0]}</p>
                        </div>
                        <div className={styles.containerDadosTexto}>
                            <strong> 30 Dias </strong>
                            <p> {dados?.qntManutencoes[1]}</p>
                        </div>
                        <div className={styles.containerDadosTexto}>
                            <strong> 60 Dias </strong>
                            <p> {dados?.qntManutencoes[2]}</p>
                        </div>
                    </div>
                </a>
                <a href="/ativos" className={styles.card}>
                    <p className={styles.containerTitulo}> Distribuição dos ativos</p>
                    <div className={styles.containerDados}>
                        <div className={styles.containerDadosTexto}>
                            <p> <strong> Disponível </strong> </p>
                            <p> {dados?.ativosPorStatus[0]} </p>
                            <p> R$ {dados?.valorPorStatus[0].toFixed(2)} </p>
                        </div>
                        <div className={styles.containerDadosTexto}>
                            <p> <strong> Em manutenção </strong> </p>
                            <p> {dados?.ativosPorStatus[1]} </p>
                            <p> R$ {dados?.valorPorStatus[1].toFixed(2)} </p>
                        </div>
                        <div className={styles.containerDadosTexto}>
                            <p> <strong> Ocupado </strong> </p>
                            <p> {dados?.ativosPorStatus[2]} </p>
                            <p> R$ {dados?.valorPorStatus[2].toFixed(2)} </p>
                        </div>
                    </div>
                </a>
                <a href="/ativos" className={styles.card}>
                    <p className={styles.containerTitulo}> Ativos próximos da expiração </p>
                    {dados?.ativosExpirando && dados?.ativosExpirando.length > 0 ? (
                        <div className={styles.containerAtivos}>
                            {dados.ativosExpirando.map((ativo) => (
                                <div className={styles.containerDadosTexto}>
                                    <p> <strong>{ativo.id}</strong> - <strong>{ativo.nome}</strong> - {new Date(ativo.dataExpiracao).getDate()}/{new Date(ativo.dataExpiracao).getMonth() + 1}/{new Date(ativo.dataExpiracao).getFullYear()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <> <p className={styles.containerDadosTexto}> Não há ativos próximos da expiração! </p></>
                    )}
                </a>
            </div>
        </>
    )
}