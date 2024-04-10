import { IAtivo } from "./ativo";

export interface IModalAtivo {
    ativo: IAtivo;
    handleClose: () => void;
}