import { IUsuario } from "./usuario";

export interface IModalUsuario {
    usuario: IUsuario;
    handleClose: () => void;
    buscarUsuarios: Function
}