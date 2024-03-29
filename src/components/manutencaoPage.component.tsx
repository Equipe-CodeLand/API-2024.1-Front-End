import { Link } from 'react-router-dom';

export default function ManutencaoPage() {
    return (
        <div>
            <h1>Manutenção</h1>
            <p>Esta é a página de manutenção</p>
            <Link to="/manutencaoCadastro">Ir para Cadastro de Manutenção</Link>
        </div>
    );
}