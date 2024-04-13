import React, { useState, FormEvent } from 'react';
import Select from 'react-select';
import styles from '../styles/formulario.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

type StatusType = { value: {id:number, nome_status:string}, label: string } | null;

export default function CadastroAtivos() {
    const [status, setStatus] = useState<StatusType>(null);
    const [nome, setNomeAtivo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [precoAquisicao, setPrecoAquisicao] = useState('');
    const [modelo, setModelo] = useState('');
    const [marca, setMarca] = useState('');
    const [funcionario, setFuncionario] = useState('');
    const [dataAquisicao, setDataAquisicao] = useState('');
    const [dataExpiracao, setDataExpiracao] = useState('');

    const statusAtivo = [
        { value: { id: 1, nome_status: "Disponível" }, label: 'Disponível' },
        { value: { id: 2, nome_status: "Em manutenção" }, label: 'Em manutenção' },
        { value: { id: 3, nome_status: "Ocupado" } , label: 'Ocupado' },
    ];

    const handleSearch = (selectedOption: StatusType) => {
        setStatus(selectedOption);
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const dataExpiracaoAjustada = new Date(dataExpiracao)
        dataExpiracaoAjustada.setDate(dataExpiracaoAjustada.getDate() + 1)

        const dataAquisicaoAjustada = new Date(dataAquisicao)
        dataAquisicaoAjustada.setDate(dataAquisicaoAjustada.getDate() + 1)

        if (!nome || !descricao || !status || !precoAquisicao || !modelo || !marca || (status.value.id=== 3 && !funcionario.trim()) || !dataAquisicao || !dataExpiracao) {
            Swal.fire({
                title: 'Erro ao cadastrar o ativo!',
                text: `Por favor, preencha todos os campos do formulário!`,
                icon: 'warning',
                confirmButtonText: 'OK!'
            })
            return;
        }

        try {
            console.log(parseFloat(precoAquisicao))
            const response = await axios.post('http://localhost:8080/cadastrar/ativos', {
                nome,
                descricao,
                status: status.value,
                preco_aquisicao: parseFloat(precoAquisicao),
                modelo,
                marca,
                funcionario,
                dataAquisicao: dataAquisicaoAjustada.toISOString().slice(0,10),
                dataExpiracao: dataExpiracaoAjustada.toISOString().slice(0, 10)
            });

            console.log(response.data);

            Swal.fire({
                title: 'Ativo cadastrado!',
                text: `O ativo ${nome} foi cadastrado com sucesso!`,
                icon: 'success',
                confirmButtonText: 'OK!'
            })

            setNomeAtivo('');
            setDescricao('');
            setStatus(null);
            setPrecoAquisicao('');
            setModelo('');
            setMarca('');
            setFuncionario('');
            setDataAquisicao('');
            setDataExpiracao('');

        } catch (error) {
            console.error('Erro ao cadastrar o ativo:', error);

            Swal.fire({
                title: 'Erro ao cadastrar o ativo!',
                text: `Ocorreu um erro ao cadastrar o ativo ${nome}. Por favor, tente novamente!`,
                icon: 'warning',
                confirmButtonText: 'OK!'
            })
        }
    }

    return (
        <div>
            <Navbar local="cadastro/ativos" />

            <div className={styles['form-container']}>
                <br />
                <h1>Cadastro de Ativos</h1>
                <br />
                <form onSubmit={handleSubmit}>
                    <label>
                        Nome do Ativo:
                        <input type="text" name="Nome do Ativo" placeholder="Nome do Ativo" value={nome} onChange={e => setNomeAtivo(e.target.value)} />
                    </label>
                    <label>
                        Descrição:
                        <input type="text" name="Descrição" placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
                    </label>
                    <label>
                        Status:
                        <Select options={statusAtivo} onChange={handleSearch} placeholder="Status" styles={{ control: (provided) => ({ ...provided, borderRadius: '20px' }) }} />
                    </label>
                    {status && status.label === 'Ocupado' && (
                        <label>
                            Nome do Funcionário:
                            <input type="text" name="Nome do Funcionário" placeholder="Funcionário Responsável" value={funcionario} onChange={e => setFuncionario(e.target.value)} />
                        </label>
                    )}
                    <label>
                        Preço de aquisição (R$):
                        <input type="text" name="Preço de aquisição" placeholder="Preço de aquisição" value={precoAquisicao} onChange={e => setPrecoAquisicao(e.target.value)} />
                    </label>
                    <label>
                        Modelo:
                        <input type="text" name="Modelo" placeholder="Modelo" value={modelo} onChange={e => setModelo(e.target.value)} />
                    </label>
                    <label>
                        Marca:
                        <input type="text" name="Marca" placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} />
                    </label>
                    <label>
                        Data de aquisição:
                        <input type="date" name="Data de aquisição" value={dataAquisicao} onChange={e => setDataAquisicao(e.target.value)} />
                    </label>
                    <label>
                        Data de expiração:
                        <input type="date" name="Data de expiração" value={dataExpiracao} onChange={e => setDataExpiracao(e.target.value)} />
                    </label>
                    <input type="submit" value="Cadastrar ativo" />
                    <br />
                </form>
            </div>

            <Footer />

        </div>
    );
}
