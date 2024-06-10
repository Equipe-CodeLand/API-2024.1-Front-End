import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import ButtonMain from './botao';
import styles from '../styles/modal.module.css'
import { FaRegEdit } from 'react-icons/fa';
import { IModalManutencao } from '../interfaces/modal';
import Swal from 'sweetalert2';
import { useAxios } from '../hooks/useAxios';
import { useAuth } from '../hooks/useAuth';

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
  const { getCargo } = useAuth();

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
        console.error('Erro ao buscar ativos:', error)
      })
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

    // Verificando se a data final é menor que a data de início
    if (new Date(formattedDataFinal) < new Date(formattedDataInicio)) {
      Swal.fire({
        title: 'Erro',
        text: 'A data final não pode ser menor que a data de início.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  
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
        props.handleClose();
        props.buscarManutencao();
      })
      .catch(error => {
        console.error('Erro ao excluir a manutenção:', error);
      });
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <>
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
              <div className='p-icon'>
                <ButtonMain
                  icon={<FaRegEdit style={{ fontSize: 30 }} />}
                  onClick={() => {
                    setIsEditing(!isEditing);
                    if (!isEditing) {
                      const ativoInicial = ativos.find((ativo) => ativo.id === props.manutencao.ativos_id);
                      setAtivoSelecionado(ativoInicial || null);
                    }
                  }}
                />
              </div>
            </div>

            <div className="conteudo-modal">
              {isEditing ? (
                <>
                  <div className='p-icon'>
                    <p>Ativo:</p>
                    <Select
                      options={ativos}
                      value={ativoSelecionado}
                      onChange={handleSearch}
                      placeholder="Pesquisar ativo"
                      styles={{ control: (provided) => ({ ...provided, borderRadius: '20px' }) }}
                    />
                  </div>
                  {ativoSelecionado && (
                    <div className='p-icon'>
                      <p>ID do ativo:</p>
                      <input type="text" value={ativoSelecionado.id} readOnly />
                    </div>
                  )}
                </>
              ) : (
                <div className='p-icon'>
                  <p>ID do ativo: {props.manutencao.ativos_id}</p>
                </div>
              )}

              <div className='p-icon'>
                <p>Responsável:
                  {isEditing ? (
                    <input type="text" value={responsavel} onChange={e => setResponsavel(e.target.value)} />
                  ) : (
                    props.manutencao.responsavel
                  )}
                  {errors.responsavel && <span className='error'>{errors.responsavel}</span>}
                </p>
              </div>

              <div className='p-icon'>
                <p>Localização:
                  {isEditing ? (
                    <input type="text" value={localizacao} onChange={e => setLocalizacao(e.target.value)} />
                  ) : (
                    props.manutencao.localizacao
                  )}
                  {errors.localizacao && <span className='error'>{errors.localizacao}</span>}
                </p>
              </div>

              <div className='p-icon'>
                <p>Data de início:
                  {isEditing ? (
                    <input type="text" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                  ) : (
                    dataInicio
                  )}
                  {errors.dataInicio && <span className='error'>{errors.dataInicio}</span>}
                </p>
              </div>

              <div className='p-icon'>
                <p>Data final:
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
          {getCargo() === "Administrador" ?
            <div className={styles.botoes}>
                <button className={styles.excluir} onClick={handleDelete}>EXCLUIR ATIVO</button>
                  {isEditing ? (
                    <button className={styles.editar} onClick={handleUpdate}>SALVAR ALTERAÇÕES</button>
                  ) : (
                    <button className={styles.editar} onClick={toggleEditing}>EDITAR</button>
                  )}
            </div> : ''
          }
        </Modal.Footer>
      </Modal>
    </>
  );
}
