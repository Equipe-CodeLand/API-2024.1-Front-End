import Routes from "./routes/routes";
import "./styles/global.css";
import { AuthContext } from "./context/authContext";
import { useState } from "react";
import { IUsuario } from "./interfaces/usuario";

function App() {
  const [ usuario, setUsuario ] = useState<IUsuario | null>();

  return (
    <AuthContext.Provider value={{ usuario, setUsuario }}>
      <Routes />
    </AuthContext.Provider>
  );
}

export default App;
