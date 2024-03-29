import React, { useState } from 'react';
import Select from 'react-select';
import '../styles/formulario.module.css';

// Define o tipo para o ativo
type AtivoType = { value: string, label: string } | null;

export default function ManutencaoCadastroPage() {
    const [ativo, setAtivo] = useState<AtivoType>(null);

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

    return (
        <div className="form-container">
            <br />
            <h1>Cadastro de Manutenções</h1>
            <form>
                <label>
                    Pesquisa de Ativo:
                    <Select options={ativos} onChange={handleSearch} placeholder="Pesquisar ativo" />
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
                            <input type="text" name="Nome do Funcionário" placeholder="Funcionário Responsável" />
                        </label>
                        <label>
                            Data de Início:
                            <input type="date" name="Data de Início" />
                        </label>
                        <label>
                            Data de Término:
                            <input type="date" name="Data de Término" />
                        </label>
                        <input type="submit" value="Cadastrar Manutenção" />
                        <br/>
                    </>
                )}
            </form>
        </div>
    );
}