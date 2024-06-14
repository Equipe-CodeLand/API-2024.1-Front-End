export interface IManutencao {
    id: number;
    nome: string;
    responsavel: string;
    localizacao: string;
    descricao: string;
    dataInicio: string;
    dataFinal: string;
    ativos_id: number;
    buscarManutencao?: Function;
    expirado: boolean;
}