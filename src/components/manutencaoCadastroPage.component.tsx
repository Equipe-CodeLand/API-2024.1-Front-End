import React, { useState, FormEvent } from 'react';
import Select from 'react-select';
import styles from '../styles/formulario.module.css';

// Define o tipo para o ativo
type AtivoType = { value: string, label: string } | null;

export default function ManutencaoCadastroPage() {
    const [ativo, setAtivo] = useState<AtivoType>(null);
    const [nomeFuncionario, setNomeFuncionario] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataTermino, setDataTermino] = useState('');

    // Simulando a busca de ativos
    const ativos = [
        { value: 'Ativo 1', label: 'Ativo 1' },
        { value: 'Ativo 2', label: 'Ativo 2' },
        { value: 'Ativo 3', label: 'Ativo 3' },
        // Adicione mais ativos de exemplo aqui
    ];

    const handleSearch = (selectedOption: AtivoType) => {
        setAtivo(selectedOption);
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const response = await fetch('http://localhost:8080/manutencaoCadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nomeAtivo: ativo?.value,
                nomeFuncionario,
                dataInicio,
                dataTermino,
            }),
        });

        const data = await response.json();
        console.log(data);

        // Se a solicitação foi bem-sucedida, exiba uma caixa de diálogo e resete o formulário
        if (response.ok) {
            alert('Manutenção cadastrada com sucesso!');
            setAtivo(null);
            setNomeFuncionario('');
            setDataInicio('');
            setDataTermino('');
        }
    };

    return (
        <div className={styles['form-container']}>
            <br />
            <h1>Cadastro de Manutenções</h1>
            <br />
            <form onSubmit={handleSubmit}>
                <label>
                    <Select options={ativos} onChange={handleSearch} placeholder="Pesquisar ativo" styles={{control: (provided) => ({...provided,borderRadius: '20px'})}}/>
                </label>
                <br/>
                {ativo && (
                    <>
                        <label>
                            Nome do Ativo:
                            <input type="text" name="Nome do Ativo" placeholder="Nome do Ativo" value={ativo.value} readOnly />
                        </label>
                        <label>
                            Funcionário Responsável:
                            <input type="text" name="Nome do Funcionário" placeholder="Funcionário Responsável" value={nomeFuncionario} onChange={e => setNomeFuncionario(e.target.value)} />
                        </label>
                        <label>
                            Data de Início:
                            <input type="date" name="Data de Início" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                        </label>
                        <label>
                            Data de Término:
                            <input type="date" name="Data de Término" value={dataTermino} onChange={e => setDataTermino(e.target.value)} />
                        </label>
                        <input type="submit" value="Cadastrar Manutenção" />
                        <br/>
                    </>
                )}
            </form>
        </div>
    );
}
