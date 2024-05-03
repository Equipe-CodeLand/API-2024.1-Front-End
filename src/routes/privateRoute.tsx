import { Navigate } from 'react-router-dom';
import AcessoNegadoPage from '../pages/acessoNegadoPage';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoute = ({ children, cargosPermitidos }: { children: JSX.Element, cargosPermitidos: string[] }) => {

  const { usuario, loading } = useAuth();

  if(loading) return <div>Carregando ...</div>

  if(!usuario){
    return <Navigate to="/login" replace/>
  }

  if( usuario && cargosPermitidos.includes(usuario.cargo)) {
    return children
  } else {
    return <AcessoNegadoPage></AcessoNegadoPage>
  }

  
};
