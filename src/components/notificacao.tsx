import { Toast } from "react-bootstrap";
import sino from "../images/sino.png"
import { useState, useEffect } from "react"
import { notificacaoProps } from "../types/notificacaoProps.type";

export default function Notificacao(props: notificacaoProps) {
    const [show, setShow] = useState<boolean>(true)
    const toggleShow = () => setShow(!show)
    const [minutos, setMinutos] = useState<number>(0)
    const titulo = props.titulo
    const texto = props.texto

    useEffect(() => {
        setTimeout(() => {
            setMinutos(minutos + 1)
        }, 60000)
    })

    return (
        <Toast show={show} onClose={toggleShow}>
            <Toast.Header>
                <img 
                    src={sino} 
                    alt="" 
                    className="rounded me-2"    
                />
                <strong className="me-auto">
                    {titulo}
                </strong>
                <small>{
                    minutos === 0 ? `Agora mesmo` : `${minutos} ${minutos === 1 ? "minuto" : "minutos"} atrás`
                }</small>
            </Toast.Header>
            <Toast.Body>
                {texto}
            </Toast.Body>
        </Toast>
    )
}