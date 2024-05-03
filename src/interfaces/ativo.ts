import { Manutencao } from "../types/manutencao.type";

export interface IAtivo {
    id: number,
    descricao: string,
    marca: string,
    modelo: string,
    nome: string,
    notaFiscal: string,
    preco_aquisicao: string,
    usuario: any,
    setor: {id: number, nome: string},
    status: {id: number, nome_status: string},
    dataAquisicao: Date,
    dataExpiracao: Date,
    manutencoes: Manutencao[]
    buscarAtivos: Function
}