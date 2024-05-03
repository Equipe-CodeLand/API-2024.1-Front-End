import { Manutencao } from "./manutencao.type"

export type AtivoType = {
    notaFiscal: string
    id: number,
    descricao: string,
    marca: string,
    modelo: string,
    nome: string,
    preco_aquisicao: number,
    usuario: { nome: string },
    usuario_id: number,
    setor: {id: number, nome: string},
    status: {id: number, nome_status: string},
    dataAquisicao: Date,
    dataExpiracao: Date,
    manutencoes: Manutencao[]
}