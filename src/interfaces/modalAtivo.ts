import { IAtivo } from "./ativo";

export interface IModalAtivo {
    disponibilidade: number;
    ativo: IAtivo;
    handleClose: () => void;
}