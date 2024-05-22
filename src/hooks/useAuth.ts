import { useContext, useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { IUsuario } from "../interfaces/usuario";
import { AuthContext } from "../context/authContext";

export const useAuth = () => {
  const { getItem, setItem } = useLocalStorage();
  const { usuario, setUsuario } = useContext(AuthContext);
  const [loading, setLoading] = useState(true)

  const addUsuario = async (user: IUsuario) => {
    setUsuario(user);
    setItem("usuario", JSON.stringify(user));
  };
  
  const removeUsuario = () => {
    setUsuario(null);
    setItem("usuario", "");
  };
  
  const login = (usuario: IUsuario) => {
    addUsuario(usuario);
  };
  
  const logout = () => {
    removeUsuario();
  };

  const getToken = () => {
    return usuario?.token
  }
  const getCargo = () => {
    return usuario?.cargo
  }

  const getSub = () => {
    return usuario?.sub
  }


  useEffect(() => {
    const user = getItem("usuario")
    if(user) {
      setUsuario(JSON.parse(user))      
    }
    setLoading(false)
  }, [])

  return { usuario, login, logout, setUsuario, getToken,  getCargo, getSub, loading };
};

