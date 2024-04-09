import { IAtivo } from "./ativo";

export interface IModalAtivo {
    nomeBotao: string
    ativo: IAtivo;
    handleClose: () => void;
}