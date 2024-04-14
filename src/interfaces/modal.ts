import { IManutencao } from "./manutencao";
export interface IModalManutencao {
    nomeBotao: string;
    handleClose: () => void;
    manutencao: IManutencao;
    buscarManutencao: Function;
}