import { Manutencao } from "../types/manutencao.type";
import { INotaFiscal } from "./notaFiscal";

export interface IAtivo {
    id: number,
    descricao: string,
    marca: string,
    modelo: string,
    nome: string,
    notaFiscal: INotaFiscal,
    codigo_nota_fiscal: string,
    preco_aquisicao: string,
    usuario: any,
    setor: {id: number, nome: string},
    status: {id: number, nome_status: string},
    dataAquisicao: Date,
    dataExpiracao: Date,
    manutencoes: Manutencao[],
    buscarAtivos: Function,
    isEditable: boolean
}