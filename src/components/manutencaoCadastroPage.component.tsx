import React, { useState, FormEvent, useEffect } from 'react';
import Select from 'react-select';
import styles from '../styles/formulario.module.css';
import Swal from 'sweetalert2';


// Define o tipo para os ativos
type AtivoType = { value: number, id: number, label: string } | null;

export default function ManutencaoCadastroPage() {
    const [ativos, setAtivos] = useState<AtivoType[]>([]);
    const [ativoSelecionado, setAtivoSelecionado] = useState<AtivoType | null>(null);
    const [responsavel, setResponsavel] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFinal, setDataFinal] = useState('');
    const [localizacao, setLocalizacao] = useState('');

    useEffect(() => {
        // Buscar ativos do servidor quando o componente é montado
        fetch('http://localhost:8080/listar/ativos')
        .then(response => response.json())
        .then(data => {
                console.log('Resposta do servidor:', data); // Log da resposta do servidor
                // Transformar os dados recebidos para o formato { value, label }
                const ativosTransformados = data.map((ativo: any) => ({
                    value: ativo,
                    id: ativo.id,
                    label: ativo.nome,
                }));
                setAtivos(ativosTransformados);
                console.log('Ativos transformados:', ativosTransformados); // Log dos ativos após a transformação
            })
        .catch(error => console.error('Erro ao buscar ativos:', error));
    }, []);

    
    const handleSearch = (selectedOption: AtivoType, _: any) => {
        if (selectedOption) {
            setAtivoSelecionado(selectedOption);
        } else {
            setAtivoSelecionado(null);
        }
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const dataFinalAjustada = new Date(dataFinal)
        dataFinalAjustada.setDate(dataFinalAjustada.getDate() + 1)

        const dataInicioAjustada = new Date(dataInicio)
        dataInicioAjustada.setDate(dataInicioAjustada.getDate() + 1)

        if (!ativoSelecionado || !responsavel || !dataInicio || !dataFinal || !localizacao) {
            Swal.fire({
                title: 'Erro ao cadastrar a manutenção!',
                text: `Por favor, preencha todos os campos do formulário!`,
                icon: 'warning',
                confirmButtonText: 'OK!'
            })
            return;
        }

        const response = await fetch(`http://localhost:8080/manutencao/cadastrar/${ativoSelecionado?.id}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ativos: ativoSelecionado?.value,
                responsavel,
                dataInicio: dataInicioAjustada.toISOString().slice(0,10),
                dataFinal: dataFinalAjustada.toISOString().slice(0, 10),
                localizacao
            }),
        });
    
        const data = await response.json();
        console.log(data); 
    
        if (response.ok) {
            Swal.fire({
                title: 'Manutenção cadastrada!',
                text: `A Manutenção foi cadastrada com sucesso!`,
                icon: 'success',
                confirmButtonText: 'OK!'
            })

            setAtivos([]);
            setResponsavel('');
            setDataInicio('');
            setDataFinal('');
            setLocalizacao('');

            window.location.reload();
        } else {
            Swal.fire({
                title: 'Erro ao cadastrar a manutenção!',
                text: `Ocorreu um erro ao cadastrar a manutenção!`,
                icon: 'error',
                confirmButtonText: 'OK!'
            })
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
                {ativos && (
                    <>
                        <label>
                            ID do Ativo:
                            <input type="text" name="ID do Ativo" placeholder="ID do Ativo" value={ativoSelecionado ? ativoSelecionado.id: ''} readOnly />
                        </label>
                        <label>
                            Responsável:
                            <input type="text" name="Responsável" placeholder="Responsável" value={responsavel} onChange={e => setResponsavel(e.target.value)} />
                        </label>
                        <label>
                            Data de Início:
                            <input type="date" name="Data de Início" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                        </label>
                        <label>
                            Data Final:
                            <input type="date" name="Data Final" value={dataFinal} onChange={e => setDataFinal(e.target.value)} />
                        </label>
                        <label>
                            Localização:
                            <input type="text" name="Localização" placeholder="Localização" value={localizacao} onChange={e => setLocalizacao(e.target.value)} />
                        </label>
                        <input type="submit" value="Cadastrar Manutenção" />
                        <br/>
                    </>
                )}
            </form>
        </div>
    );
}