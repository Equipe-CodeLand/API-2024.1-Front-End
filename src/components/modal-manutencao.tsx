import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import ButtonMain from './botao';
import '../styles/modal.css'
import { FaRegEdit } from 'react-icons/fa';
import { IModalManutencao } from '../interfaces/modal';
import axios from 'axios';

export default function ModalManutencao(props: IModalManutencao) {
  const [show, setShow] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [dataInicio, setDataInicio] = useState(props.manutencao.dataInicio);
  const [dataFinal, setDataFinal] = useState(props.manutencao.dataFinal);
  const [localizacao, setLocalizacao] = useState(props.manutencao.localizacao);
  const [responsavel, setResponsavel] = useState(props.manutencao.responsavel);
  const [ativosId, setAtivosId] = useState(props.manutencao.ativos_id);
  useEffect(() => {
    setAtivosId(ativosId);
  }, [ativosId]);

  const handleUpdate = () => {
    const dadosAtualizados = {
      data_inicio: dataInicio,
      data_final: dataFinal,
      localizacao: localizacao,
      responsavel: responsavel,
      ativos_id: ativosId
    };

    axios
      .put(`http://localhost:8080/manutencao/${props.manutencao.id}`, dadosAtualizados)
      .then(response => {
        console.log('Dados atualizados com sucesso:', response.data);
        console.log(dadosAtualizados);
        props.handleClose();
        window.location.reload();
      })
      .catch(error => {
        console.error('Erro ao atualizar os dados:', error);
      });
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:8080/manutencao/${props.manutencao.id}`)
      .then(response => {
        console.log('Manutenção excluída com sucesso:', response.data);
        console.log(props.manutencao.id);
        props.handleClose();
        window.location.reload();
      })
      .catch(error => {
        console.error('Erro ao excluir a manutenção:', error);
      });
  }

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
              {props.manutencao.nome}
            </h3>
            <div className='p-icon'>
              <p className='ativo_id'>
                #{ativosId}
                {isEditing ? (
                  <input className='id' type="number" value={ativosId} onChange={e => setAtivosId(Number(e.target.value))} />
                ) : (
                  props.manutencao.ativos_id
                )}
              </p>
              <ButtonMain
                icon={<FaRegEdit style={{ fontSize: 30 }} />}
                onClick={() => setIsEditing(!isEditing)}
              />
            </div>
          </div>

          <div className="conteudo-modal">
            <div className='p-icon'>
              <p>Responsável: 
              {isEditing ? (
                <input type="text" value={responsavel} onChange={e => setResponsavel(e.target.value)} />
              ) : (
                props.manutencao.responsavel 
              )}
              </p>
              <ButtonMain
                icon={<FaRegEdit style={{ fontSize: 30 }} />}
                onClick={() => setIsEditing(!isEditing)}
              />
            </div>

            <div className='p-icon'>
              <p>Localização:
                {isEditing ? (
                  <input type="text" value={localizacao} onChange={e => setLocalizacao(e.target.value)} />
                ) : (
                  props.manutencao.localizacao
                )}
              </p>
              <ButtonMain
                icon={<FaRegEdit style={{ fontSize: 30 }} />}
                onClick={() => setIsEditing(!isEditing)}
              />
            </div>

            <div className='p-icon'>
              <p>Data de início: 
                {isEditing ? (
                  <input type="text" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                ) : (
                  props.manutencao.dataInicio
                )}
              </p>
              <ButtonMain
                icon={<FaRegEdit style={{ fontSize: 30 }} />}
                onClick={() => setIsEditing(!isEditing)}
              />
            </div>

            <div className='p-icon'>
              <p>Data final: 
                {isEditing ? (
                  <input type="text" value={dataFinal} onChange={e => setDataFinal(e.target.value)} />
                ) : (
                  props.manutencao.dataFinal
                )}
              </p>
              <ButtonMain
                icon={<FaRegEdit style={{ fontSize: 30 }} />}
                onClick={() => setIsEditing(!isEditing)}
              />
            </div>
          </div>
        </div>

        </Modal.Body>
        <Modal.Footer>
          <div className='botoes-modal'>
            <div>
              <ButtonMain
                title={'Excluir manutenção'}
                bg='#DB5050'
                width='180px'
                height='40px'
                onClick={handleDelete}
              />
            </div>
            <div className='btn-atualizar-modal'>
              <ButtonMain
                title={'Atualizar manutenção'}
                bg={'var(--corPrimaria)'}
                width='200px'
                height='40px'
                onClick={handleUpdate}
              />
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}