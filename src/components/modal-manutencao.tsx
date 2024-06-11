import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import ButtonMain from './botao';
import '../styles/modal.css';
import { FaRegEdit } from 'react-icons/fa';
import { IModalManutencao } from '../interfaces/modal';
import Swal from 'sweetalert2';
import { useAxios } from '../hooks/useAxios';

type AtivoType = { value: number, id: number, label: string };

export default function ModalManutencao(props: IModalManutencao) {
  const [show, setShow] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [dataInicio, setDataInicio] = useState(new Date(props.manutencao.dataInicio).toLocaleDateString('pt-BR'));
  const [dataFinal, setDataFinal] = useState(new Date(props.manutencao.dataFinal).toLocaleDateString('pt-BR'));
  const [localizacao, setLocalizacao] = useState(props.manutencao.localizacao);
  const [responsavel, setResponsavel] = useState(props.manutencao.responsavel);
  const [ativos, setAtivos] = useState<AtivoType[]>([]);
  const [ativoSelecionado, setAtivoSelecionado] = useState<AtivoType | null>(null);
  const { get, put, deletar } = useAxios();

  const [errors, setErrors] = useState({
    responsavel: '',
    localizacao: '',
    dataInicio: '',
    dataFinal: ''
  });

  useEffect(() => {
    get("/listar/ativos")
      .then(response => {
        const ativosTransformados = response.data.map((ativo: any) => ({
          value: ativo.id,
          id: ativo.id,
          label: ativo.nome,
        }));
        setAtivos(ativosTransformados);
      })
      .catch(error => {
        console.error('Erro ao buscar ativos:', error);
      });
  }, []);

  const handleSearch = (selectedOption: any) => {
    if (selectedOption) {
      setAtivoSelecionado(selectedOption);
    } else {
      setAtivoSelecionado(null);
    }
  };

  const handleUpdate = () => {
    if (!validateFields()) return;

    const formattedDataInicio = formatDateForBackend(dataInicio);
    const formattedDataFinal = formatDateForBackend(dataFinal);

    const dadosAtualizados = {
      data_inicio: formattedDataInicio,
      data_final: formattedDataFinal,
      localizacao: localizacao,
      responsavel: responsavel,
      ativos_id: ativoSelecionado ? ativoSelecionado.id : null,
    };

    put(`/manutencao/${props.manutencao.id}`, dadosAtualizados)
      .then(response => {
        Swal.fire({
          title: 'Manutenção Atualizada!',
          text: `A manutenção foi atualizada com sucesso!`,
          icon: 'success',
          confirmButtonText: 'OK!'
        });
        console.log('Dados atualizados com sucesso:', response.data);
        console.log(dadosAtualizados);
        props.handleClose();
        props.buscarManutencao();
      })
      .catch(error => {
        console.error('Erro ao atualizar os dados:', error);
      });
  };

  const validateFields = () => {
    const newErrors: any = {};
    if (!responsavel) newErrors.responsavel = "Preencha o campo obrigatório acima";
    if (!localizacao) newErrors.localizacao = "Preencha o campo obrigatório acima";
    if (!dataInicio) newErrors.dataInicio = "Preencha o campo obrigatório acima";
    if (!dataFinal) newErrors.dataFinal = "Preencha o campo obrigatório acima";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDateForBackend = (dateString: any) => {
    const parts = dateString.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const handleDelete = () => {
    deletar(`/manutencao/${props.manutencao.id}`)
      .then(response => {
        Swal.fire({
          title: 'Manutenção Deletada!',
          text: `A manutenção foi deletada com sucesso!`,
          icon: 'success',
          confirmButtonText: 'OK!'
        });
        console.log('Manutenção excluída com sucesso:', response.data);
        console.log(props.manutencao.id);
        props.handleClose();
        props.buscarManutencao();
      })
      .catch(error => {
        console.error('Erro ao excluir a manutenção:', error);
      });
  };

  return (
    <Modal show={show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>ID : {props.manutencao.id}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className='body-modal'>
          <div className='titulo-id'>
            <h3 className='titulo'>
              {ativoSelecionado ? ativoSelecionado.label : props.manutencao.nome}
            </h3>
            <div className='i-icon'>
              <ButtonMain
                icon={<FaRegEdit style={{ fontSize: 30 }} />}
                onClick={() => {
                  setIsEditing(!isEditing);
                  // Definir ativo selecionado quando entrar no modo de edição
                  if (!isEditing) {
                    const ativoInicial = ativos.find((ativo) => ativo.id === props.manutencao.ativos_id);
                    setAtivoSelecionado(ativoInicial || null);
                  }
                }}
              />
            </div>
          </div>

          <div className="conteudo-modal">
            <div className='p-icon'>
              <p><strong>Ativo: </strong>
                {isEditing ? (
                  <Select
                    options={ativos}
                    value={ativoSelecionado}
                    onChange={handleSearch}
                    placeholder="Pesquisar ativo"
                    styles={{ control: (provided) => ({ ...provided, borderRadius: '30px'}) }}
                  />
                ) : (
                  ativoSelecionado ? ativoSelecionado.label : props.manutencao.nome
                )}
              </p>
            </div>
            <div className='p-icon'>
              <p><strong>ID do ativo: </strong>
                {isEditing ? (
                  <input type="text" value={ativoSelecionado ? ativoSelecionado.id : ''} readOnly />
                ) : (
                  props.manutencao.ativos_id
                )}
              </p>
            </div>
            <div className='p-icon'>
              <p><strong>Responsável: </strong>
                {isEditing ? (
                  <input type="text" value={responsavel} onChange={e => setResponsavel(e.target.value)} />
                ) : (
                  props.manutencao.responsavel
                )}
                {errors.responsavel && <span className='error'>{errors.responsavel}</span>}
              </p>
            </div>
            <div className='p-icon'>
              <p><strong>Localização: </strong>
                {isEditing ? (
                  <input type="text" value={localizacao} onChange={e => setLocalizacao(e.target.value)} />
                ) : (
                  props.manutencao.localizacao
                )}
                {errors.localizacao && <span className='error'>{errors.localizacao}</span>}
              </p>
            </div>
            <div className='p-icon'>
              <p><strong>Data de início: </strong> 
                {isEditing ? (
                  <input type="text" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                ) : (
                  dataInicio
                )}
                {errors.dataInicio && <span className='error'>{errors.dataInicio}</span>}
              </p>
            </div>
            <div className='p-icon'>
              <p><strong>Data final: </strong> 
                {isEditing ? (
                  <input type="text" value={dataFinal} onChange={e => setDataFinal(e.target.value)} />
                ) : (
                  dataFinal
                )}
                {errors.dataFinal && <span className='error'>{errors.dataFinal}</span>}
              </p>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
      <div className='botoes-modal'>
        <div>
          <ButtonMain
            title={'EXCLUIR MANUTENÇÃO'}
            bg='#DB5050'
            onClick={handleDelete}
          />
        </div>
        {isEditing && (
          <div className='btn-atualizar-modal'>
            <ButtonMain
              title={'SALVAR MANUTENÇÃO'}
              bg={'var(--corPrimaria)'}
              onClick={handleUpdate}
            />
          </div>
        )}
      </div>
    </Modal.Footer>
    </Modal>
  );
}
