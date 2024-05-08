import { AtivoType } from "../types/ativo.type";

export interface IUsuario {
    id?: number,
    nome?: string,
    cpf?: string,
    cargo: string,
    ativos?: AtivoType[],
    buscarUsuarios?: Function
    sub?: string
    token?: string;
    estaAtivo?: boolean
}