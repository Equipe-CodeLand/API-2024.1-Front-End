import { Manutencao } from "../types/manutencao.type";

export interface IAtivo {
    id: number,
    descricao: string,
    marca: string,
    modelo: string,
    nome: string,
    preco_aquisicao: number,
    funcionario: string,
    setor: {id: number, nome: string},
    status: {id: number, descricao: string},
    dataAquisicao: Date,
    dataExpiracao: Date,
    manutencoes: Manutencao[]
}