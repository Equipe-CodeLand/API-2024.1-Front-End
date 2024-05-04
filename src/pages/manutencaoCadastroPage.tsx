import React, { useState, FormEvent, useEffect } from 'react';
import Select from 'react-select';
import styles from '../styles/formulario.module.css';
import Swal from 'sweetalert2';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useAxios } from '../hooks/useAxios';


// Define o tipo para os ativos
type AtivoType = { value: number, id: number, label: string } | null;

export default function ManutencaoCadastroPage() {
    const [ativos, setAtivos] = useState<AtivoType[]>([]);
    const [ativoSelecionado, setAtivoSelecionado] = useState<AtivoType | null>(null);
    const [responsavel, setResponsavel] = useState('');
    const [data_inicio, setData_inicio] = useState('');
    const [data_final, setData_final] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const { get, post } = useAxios()

    useEffect(() => {
        // Buscar ativos do servidor quando o componente é montado
        get("/listar/ativos")
            .then(response => {
                console.log('Resposta do servidor:', response.data); // Log da resposta do servidor
                // Transformar os dados recebidos para o formato { value, label }
                const ativosTransformados = response.data.map((ativo: any) => ({
                    value: ativo,
                    id: ativo.id,
                    label: ativo.nome,
                }));
                setAtivos(ativosTransformados);
                console.log('Ativos transformados:', ativosTransformados);  // Log dos ativos após a transformação
            })
            .catch(error => {
                console.error('Erro ao buscar ativos:', error)
            })
    }, []);

    
    const handleSearch = (selectedOption: AtivoType, _: any) => {
        if (selectedOption) {
            setAtivoSelecionado(selectedOption);
        } else {
            setAtivoSelecionado(null);
        }
    }

    // formatando a data para enviar para o back-end
    const formatDateForBackend = (dateString: string) => {
        const parts = dateString.split('-');
        return `${parts[2]}-${parts[1]}-${parts[0]}`; // Formato "yyyy-MM-dd"
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        // Convertendo as datas para o formato desejado (dd/MM/yyyy) para envio
        const formattedDataInicio = formatDateForBackend(data_inicio);
        const formattedDataFinal = formatDateForBackend(data_final);

        if (!ativoSelecionado || !responsavel || !data_inicio || !data_final || !localizacao) {
            Swal.fire({
                title: 'Erro ao cadastrar a manutenção!',
                text: `Por favor, preencha todos os campos do formulário!`,
                icon: 'warning',
                confirmButtonText: 'OK!'
            })
            return;
        }

        post(`/manutencao/cadastrar/${ativoSelecionado?.id}`, {
                ativos: ativoSelecionado?.value,
                responsavel,
                data_inicio: formattedDataInicio,
                data_final: formattedDataFinal,
                localizacao,
            })
            .then(() => {
                Swal.fire({
                    title: 'Manutenção cadastrada!',
                    text: `A Manutenção foi cadastrada com sucesso!`,
                    icon: 'success',
                    confirmButtonText: 'OK!'
                })
    
                setAtivos([]);
                setResponsavel('');
                setData_inicio('');
                setData_final('');
                setLocalizacao('');
            })
            .catch(() => {
                Swal.fire({
                    title: 'Erro ao cadastrar a manutenção!',
                    text: `Ocorreu um erro ao cadastrar a manutenção!`,
                    icon: 'error',
                    confirmButtonText: 'OK!'
                })
            })
    };

    return (
        <>
        <Navbar local='manutencaoPage' />
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
                            ID do Ativo: <span className={styles.required}>*</span>
                            <input type="text" name="ID do Ativo" placeholder="ID do Ativo" value={ativoSelecionado ? ativoSelecionado.id: ''} readOnly />
                        </label>
                        <label>
                            Responsável: <span className={styles.required}>*</span>
                            <input type="text" name="Responsável" placeholder="Responsável" value={responsavel} onChange={e => setResponsavel(e.target.value)} />
                        </label>
                        <label>
                            Data de Início: <span className={styles.required}>*</span>
                            <input type="date" name="Data de Início" value={data_inicio} onChange={e => setData_inicio(e.target.value)} />
                        </label>
                        <label>
                            Data Final: <span className={styles.required}>*</span>
                            <input type="date" name="Data Final" value={data_final} onChange={e => setData_final(e.target.value)} />
                        </label>
                        <label>
                            Localização: <span className={styles.required}>*</span>
                            <input type="text" name="Localização" placeholder="Localização" value={localizacao} onChange={e => setLocalizacao(e.target.value)} />
                        </label>

                        <input type="submit" value="Cadastrar Manutenção" />
                        <br/>
                    </>
                )}
            </form>
        </div>
        <Footer />
        </>
    );
}