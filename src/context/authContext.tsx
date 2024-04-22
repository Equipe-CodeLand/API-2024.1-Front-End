import { createContext } from "react";
import { IUsuario } from "../interfaces/usuario";

interface AuthContext {
    usuario: IUsuario | null | undefined;
    setUsuario: (usuario: IUsuario | null) => void;
}

export const AuthContext = createContext<AuthContext>({
    usuario: null,
    setUsuario: () => {}
});

