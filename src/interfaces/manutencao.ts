export interface IManutencao {
    id: number;
    nome: string;
    responsavel: string;
    localizacao: string;
    dataInicio: string;
    dataFinal: string;
    ativos_id: number;
    buscarManutencao: Function;
}