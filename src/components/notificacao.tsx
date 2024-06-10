import { Toast } from "react-bootstrap";
import sino from "../images/sino.png"
import { useState, useEffect } from "react"
import { notificacaoProps } from "../types/notificacaoProps.type";

export default function Notificacao(props: notificacaoProps) {
    const [show, setShow] = useState<boolean>(false)
    const [minutos, setMinutos] = useState<number>(0)
    const titulo = props.titulo
    const texto = props.texto
    const repetirNotificacao = props.repetirNotificacao
    const key = props.titulo
    const toggleShow = () => {
        setShow(false)
        if (repetirNotificacao === false) {
            localStorage.setItem(`notificacao_${key}`, "false")
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setMinutos(minutos + 1)
        }, 60000)
    })

    useEffect(() => {
        const notificacao = localStorage.getItem(`notificacao_${key}`)
        console.log(notificacao)
        console.log(show)
        if (notificacao === null) {
            setShow(true)
            const listaJsonRecuperada = localStorage.getItem("notificacoes");
            const listaRecuperada = JSON.parse(listaJsonRecuperada || "[]");
            if (listaRecuperada.length === 0) {
                listaRecuperada.push({
                    id: key,
                    mensagem: texto,
                    titulo: titulo
                })
            } else {
                listaRecuperada.unshift({
                    id: key,
                    mensagem: texto,
                    titulo: titulo
                })
            }
            localStorage.setItem("notificacoes", JSON.stringify(listaRecuperada))
        }
    }, [])

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