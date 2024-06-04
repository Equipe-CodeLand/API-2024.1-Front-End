import { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import Select from 'react-select';
import styles from '../styles/formulario.module.css';
import Swal from 'sweetalert2';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import { useAxios } from '../hooks/useAxios';

type StatusType = { value: { id: number, nome_status: string }, label: string } | null;

type UsuarioType = { value: number, id: number, nome: string } | null;

export default function CadastroAtivos() {
    const [status, setStatus] = useState<StatusType>(null);
    const [nome, setNomeAtivo] = useState('');
    const [notaFiscal, setNotaFiscal] = useState<File>();
    const [codigo_nota_fiscal, setCodigo_nota_fiscal] = useState('');
    const [descricao, setDescricao] = useState('');
    const [precoAquisicao, setPrecoAquisicao] = useState('');
    const [modelo, setModelo] = useState('');
    const [marca, setMarca] = useState('');
    const [usuario, setUsuario] = useState<UsuarioType[]>([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<UsuarioType | null>(null);
    const [dataAquisicao, setDataAquisicao] = useState('');
    const [dataExpiracao, setDataExpiracao] = useState('');
    const [notaFiscalOption, setNotaFiscalOption] = useState('');
    const { get } = useAxios()
    const { post } = useAxios()

    const statusAtivo = [
        { value: { id: 1, nome_status: "Disponível" }, label: 'Disponível' },
        { value: { id: 3, nome_status: "Ocupado" }, label: 'Ocupado' },
    ];

    useEffect(() => {
        get('http://localhost:8080/usuario/listar')
            .then(response => {
                const usuarios = response.data.map((usuario: any) => ({
                    value: usuario,
                    id: usuario.id,
                    label: usuario.nome,
                }));
                setUsuario(usuarios);
                console.log(usuarios)
            })
            .catch(error => console.error('Erro ao buscar usuários:', error));
    }, []);

    const handleNotaFiscal = (e: any) => {
        e.target.files[0] ? setNotaFiscal(e.target.files[0]) : setNotaFiscal(undefined)
    }


    const handleUsuarioSearch = (selectedOption: UsuarioType, _: any) => {
        if (selectedOption) {
            setUsuarioSelecionado(selectedOption);
            console.log(usuarioSelecionado)
        } else {
            setUsuarioSelecionado(null);
        }
    }

    const handleSearch = (selectedOption: StatusType) => {
        setStatus(selectedOption);
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();


        if (!nome || !status || !precoAquisicao || (status.value.id === 3 && !usuarioSelecionado) || !dataAquisicao) {
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
            let form = new FormData();
            let ativosDto = {
                nome,
                descricao,
                status: status.value,
                preco_aquisicao: parseFloat(precoAquisicao),
                modelo,
                marca,
                codigo_nota_fiscal,
                usuario: usuarioSelecionado?.value,
                dataAquisicao,
                dataExpiracao
            }
            let json = JSON.stringify(ativosDto)
            form.append("ativosDto", new Blob([json], { type: 'application/json' }))
            if (notaFiscal) {
                form.append("file", notaFiscal)
            }
            const response = await post('http://localhost:8080/cadastrar/ativos', form, { headers: { "Content-Type": "multipart/form-data" } });

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
            setCodigo_nota_fiscal('');
            setUsuarioSelecionado(null);
            setDataAquisicao('');
            setDataExpiracao('');

        } catch (error) {
            console.error('Erro ao cadastrar o ativo:', error);

            Swal.fire({
                title: 'Erro ao cadastrar o ativo!',
                text: `Ocorreu um erro ao cadastrar o ativo ${nome}. Por favor, tente novamente!`,
                icon: 'warning',
                confirmButtonText: 'OK!'
            }).then(() => {
                window.location.href = '/ativos';
            });
        }
    }

    return (
        <div>
            <Navbar local="cadastro/ativos" />
            <main>
            <div className={styles['form-container']}>
                <br />
                <h1>Cadastro de Ativos</h1>
                <br />
                <form onSubmit={handleSubmit}>
                    <label>
                        <span className="input_required">Nome do Ativo:</span>
                        <br />
                        <input type="text" name="Nome do Ativo" placeholder="Nome do Ativo" value={nome} onChange={e => setNomeAtivo(e.target.value)}  />
                    </label>
                    <label>
                    Descrição:
                    <br />
                    <textarea name="Descrição" placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} rows={2} 
                    />
                    </label>
                    <label>
                    <span className='input_required'>Arquivo da Nota Fiscal ou Código da Nota Fiscal:</span>
                    <br />
                    <select value={notaFiscalOption} onChange={e => setNotaFiscalOption(e.target.value)} >
                        <option value="">Selecionar opção</option>
                        <option value="notaFiscal">Arquivo</option>
                        <option value="codigoNotaFiscal">Código</option>
                    </select>
                    </label>
                    {notaFiscalOption === 'notaFiscal' && (
                        <label>
                            Arquivo da Nota Fiscal:
                            <br />
                            <input type="file" name="Arquivo da Nota Fiscal" onChange={e => handleNotaFiscal(e)} accept="application/pdf,application/xml,text/xml" />
                        </label>
                    )}
                    {notaFiscalOption === 'codigoNotaFiscal' && (
                        <label>
                            Código da Nota Fiscal:
                            <br />
                            <input type="text" name="Código da Nota Fiscal" placeholder="Código da Nota Fiscal" value={codigo_nota_fiscal} onChange={e => setCodigo_nota_fiscal(e.target.value)} />
                        </label>
                    )}
                    {/* <label>
                        Nota Fiscal:
                        <br />
                        <input type="file" name="Nota fiscal" onChange={e => handleNotaFiscal(e)} accept="application/pdf,application/xml,text/xml" />
                    </label>
                    <label>
                        Código da Nota Fiscal:
                        <br />
                        <input type="text" name="Código da Nota Fiscal" placeholder="Código da Nota Fiscal" value={codigo_nota_fiscal} onChange={e => setCodigo_nota_fiscal(e.target.value)} />
                    </label> */}
                    <label>
                        <span className='input_required'>Status:</span>
                        <br />
                        <Select options={statusAtivo} onChange={handleSearch} placeholder="Status" styles={{ control: (provided) => ({ ...provided, borderRadius: '20px' }) }} />
                    </label>
                    {status && status.label === 'Ocupado' && (
                        <label>
                            <span className="input_required">Funcionário Responsável:</span>
                            <Select options={usuario} onChange={handleUsuarioSearch} placeholder="Pesquisar Usuário" styles={{ control: (provided) => ({ ...provided, borderRadius: '20px' }) }} />
                        </label>
                    )}
                    <label>
                        <span className='input_required'>Preço de aquisição (R$):</span>
                        <br />
                        <input type="text" name="Preço de aquisição" placeholder="Preço de aquisição" value={precoAquisicao} onChange={e => setPrecoAquisicao(e.target.value)} />
                    </label>
                    <div className={styles['date-fields']}>
                    <label className={styles['date-field']}>
                        Modelo:
                        <br />
                        <input type="text" name="Modelo" placeholder="Modelo" value={modelo} onChange={e => setModelo(e.target.value)} />
                    </label>
                    <label className={styles['date-field']}>
                        Marca:
                        <br />
                        <input type="text" name="Marca" placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} />
                    </label>
                    </div>
                    <div className={styles['date-fields']}>
                    <label className={styles['date-field']}>
                        <span className="input_required">Data de aquisição:</span>
                        <br />
                        <input type="date" name="Data de aquisição" value={dataAquisicao} onChange={e => setDataAquisicao(e.target.value)} />
                    </label>
                    <label className={styles['date-field']}>
                        Data de expiração:
                        <br />
                        <input type="date" name="Data de expiração" value={dataExpiracao} onChange={e => setDataExpiracao(e.target.value)} />
                    </label>
                    </div>
                    <input type="submit" value="Cadastrar ativo" />
                    <br />
                </form>
            </div>
            </main>
            <Footer />

        </div>
    );
}