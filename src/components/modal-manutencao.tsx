import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ButtonMain from './botao';
import '../styles/modal.css'
import { FaRegEdit } from 'react-icons/fa';
import { IModalManutencao } from '../interfaces/modal';

export default function ModalManutencao(props: IModalManutencao) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {props.nomeBotao}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ID : {props.id}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className='body-modal'>
            <h3 className='titulo'>{props.title}</h3>
            <ButtonMain
              icon={<FaRegEdit style={{ fontSize: 30 }} />}
            />

            <p>Responsável: {props.responsavel}</p>
            <ButtonMain
              icon={<FaRegEdit style={{ fontSize: 30 }} />}
            />

            <p>Localização: {props.localizacao}</p>
            <ButtonMain
              icon={<FaRegEdit style={{ fontSize: 30 }} />}
            />

            <p>Data de início: {props.dataInicio}</p>
            <ButtonMain
              icon={<FaRegEdit style={{ fontSize: 30 }} />}
            />

            <p>Data final: {props.dataFinal}</p>
            <ButtonMain
              icon={<FaRegEdit style={{ fontSize: 30 }} />}
            />
          </div>

        </Modal.Body>
        <Modal.Footer>
          <div className="btn-excluir-container">
            <ButtonMain
              title={"Excluir manutenção"}
              bg="#DB5050"
              width='180px'
              height='40px'
            />
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}