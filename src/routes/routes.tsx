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
import NotFoundPage from "../pages/notFoundPage";

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/home" element={
                    <PrivateRoute cargosPermitidos={['Administrador', 'Funcionário']}>
                        <HomePage />
                    </PrivateRoute>
                }/>                
                <Route path="/" element={<LoginPage />} />
                <Route path="/ativos" element={
                    <PrivateRoute cargosPermitidos={['Administrador', 'Funcionário']}>
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
                <Route path="/cadastrar/usuarios" element={
                    <PrivateRoute cargosPermitidos={['Administrador']}>
                           <UsuariosCadastroPage />
                    </PrivateRoute>             
                } />
                <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
            </Switch>
        </BrowserRouter>
    );
}