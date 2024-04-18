import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import HomePage from "../pages/homePage";
import AtivosPage from "../pages/ativosPage";
import ManutencaoPage from "../pages/manutencaoPage";
import CadastroAtivos from "../pages/ativosCadastroPage";
import RouteManutecaoCadastro from "../pages/manutencaoCadastroPage";
import LoginPage from "../pages/loginPage";
import UsuariosPage from "../pages/usuariosPage";

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/ativos" element={<AtivosPage />} />
                <Route path="/manutencao" element={<ManutencaoPage />} />
                <Route path="/usuarios" element={<UsuariosPage />} />
                <Route path="/cadastrar/ativos" element={<CadastroAtivos />} />
                <Route path="/cadastrar/manutencoes" element={<RouteManutecaoCadastro />} />
            </Switch>
        </BrowserRouter>
    );
}