import React, { useState, FormEvent } from 'react';
import Select from 'react-select';
import styles from '../styles/formulario.module.css';
import Swal from 'sweetalert2';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import { useAxios } from '../hooks/useAxios';

type StatusType = { value: {id:number, nome_status:string}, label: string } | null;

export default function CadastroAtivos() {
    const [status, setStatus] = useState<StatusType>(null);
    const [nome, setNomeAtivo] = useState('');
    const [notaFiscal, setNotaFiscal] = useState('');
    const [descricao, setDescricao] = useState('');
    const [precoAquisicao, setPrecoAquisicao] = useState('');
    const [modelo, setModelo] = useState('');
    const [marca, setMarca] = useState('');
    const [funcionario, setFuncionario] = useState('');
    const [dataAquisicao, setDataAquisicao] = useState('');
    const [dataExpiracao, setDataExpiracao] = useState('');
    const { post } = useAxios()

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


        if (!nome || !notaFiscal || !descricao || !status || !precoAquisicao || !modelo || !marca || (status.value.id=== 3 && !funcionario.trim()) || !dataAquisicao || !dataExpiracao) {
            Swal.fire({
                title: 'Erro ao cadastrar o ativo!',
                text: `Por favor, preencha todos os campos do formulário!`,
                icon: 'warning',
                confirmButtonText: 'OK!'
            })
            return;
        }

        console.log(parseFloat(precoAquisicao))

        post('/cadastrar/ativos', {
            nome,
            notaFiscal,
            descricao,
            status: status.value,
            preco_aquisicao: parseFloat(precoAquisicao),
            modelo,
            marca,
            funcionario,
            dataAquisicao,
            dataExpiracao})
                .then(response => {
                    console.log(response.data);

                    Swal.fire({
                        title: 'Ativo cadastrado!',
                        text: `O ativo ${nome} foi cadastrado com sucesso!`,
                        icon: 'success',
                        confirmButtonText: 'OK!'
                    })

                    setNomeAtivo('');
                    setNotaFiscal('');
                    setDescricao('');
                    setStatus(null);
                    setPrecoAquisicao('');
                    setModelo('');
                    setMarca('');
                    setFuncionario('');
                    setDataAquisicao('');
                    setDataExpiracao('');
                }).catch( error => {
                    console.error('Erro ao cadastrar o ativo:', error);

                    Swal.fire({
                        title: 'Erro ao cadastrar o ativo!',
                        text: `Ocorreu um erro ao cadastrar o ativo ${nome}. Por favor, tente novamente!`,
                        icon: 'warning',
                        confirmButtonText: 'OK!'
                    })
                })
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
                        Código da Nota Fiscal:
                        <input type="text" name="Código da Nota Fiscal" placeholder="Código da Nota Fiscal" value={notaFiscal} onChange={e => setNotaFiscal(e.target.value)} />
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