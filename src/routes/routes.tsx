import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import HomePage from "../pages/homePage";
import AtivosPage from "../pages/ativosPage";
import ManutencaoPage from "../pages/manutencaoPage";

export default function Routes(){
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" element={<HomePage />} />
                <Route path="/ativos" element={<AtivosPage />} />
                <Route path="/manutencao" element={<ManutencaoPage />} />
            </Switch>
        </BrowserRouter>
    );
}