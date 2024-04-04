import { Button } from 'react-bootstrap'
import { IBotao } from '../interfaces/botao'

export default function ButtonMain(props: IBotao) {
    return (
        <Button 
            onClick={props.onClick}
            style={{ 
                width: props.width,
                height: props.height,
                border: 'none',
                background: props.bg || 'none',
                cursor: 'pointer',
                color: props.color || '#000',
                borderRadius: 10,
                fontWeight: '600'
            }}
        >
            {props.title} 
            {props.icon && props.icon}
        </Button>
    )
}