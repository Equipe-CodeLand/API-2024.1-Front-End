import { IAtivo } from "./ativo";

export default interface Dashboard {
    ativos: IAtivo[],
    valorTotal: number,
    qntManutencoes: number[],
    valorPorStatus: number[],
    ativosPorStatus: number[],
    ativosExpirando: IAtivo[],
}