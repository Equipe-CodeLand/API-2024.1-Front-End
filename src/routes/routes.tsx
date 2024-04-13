import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import HomePage from "../pages/homePage";
import AtivosPage from "../pages/ativosPage";
import ManutencaoPage from "../pages/manutencaoPage";
import CadastroAtivos from "../pages/ativosCadastroPage";
import RouteManutecaoCadastro from "../pages/manutencaoCadastroPage";

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" element={<HomePage />} />
                <Route path="/ativos" element={<AtivosPage />} />
                <Route path="/manutencao" element={<ManutencaoPage />} />
                <Route path="/cadastrar/ativos" element={<CadastroAtivos />} />
                <Route path="/cadastrar/manutencoes" element={<RouteManutecaoCadastro />} />
            </Switch>
        </BrowserRouter>
    );
}