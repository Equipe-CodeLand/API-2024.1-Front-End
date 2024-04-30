import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import HomePage from "../pages/homePage";
import AtivosPage from "../pages/ativosPage";
import ManutencaoPage from "../pages/manutencaoPage";
import CadastroAtivos from "../pages/ativosCadastroPage";
import RouteManutecaoCadastro from "../pages/manutencaoCadastroPage";
import LoginPage from "../pages/loginPage";
import UsuariosPage from "../pages/usuariosPage";
import { PrivateRoute } from "./privateRoute";
import UsuariosCadastroPage from "../pages/usuariosCadastroPage";

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={
                    <PrivateRoute cargosPermitidos={['Administrador']}>
                        <HomePage />
                    </PrivateRoute>
                }/>                
                <Route path="/ativos" element={
                    <PrivateRoute cargosPermitidos={['Administrador']}>
                        <AtivosPage />
                    </PrivateRoute>
                }/>
                <Route path="/manutencao" element={
                    <PrivateRoute cargosPermitidos={['Administrador']}>
                        <ManutencaoPage />
                    </PrivateRoute>
                }/>
                <Route path="/usuarios" element={
                    <PrivateRoute cargosPermitidos={['Administrador']}>
                        <UsuariosPage />
                    </PrivateRoute>
                }/>
                <Route path="/cadastrar/ativos" element={
                    <PrivateRoute cargosPermitidos={['Administrador']}>
                        <CadastroAtivos />
                    </PrivateRoute>
                } />
                <Route path="/cadastrar/manutencoes" element={
                    <PrivateRoute cargosPermitidos={['Administrador']}>
                        <RouteManutecaoCadastro />
                    </PrivateRoute>
                } />
                <Route path="/cadastrar/usuarios" element={<UsuariosCadastroPage />} />
            </Switch>
        </BrowserRouter>
    );
}