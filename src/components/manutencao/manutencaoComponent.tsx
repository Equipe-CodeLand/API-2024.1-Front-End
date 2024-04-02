import './style.css';

type props = {
    id: number,
    nome: string,
    dataInicio: string,
    dataFinal: string
}

function ManutencaoComponent(props: props) {
    return(
        <div>
            <section className='manutencao'>
                <div className='id'>ID: {props.id}</div>
                <div className='nome'>{props.nome}</div>
                <div className='datas'>{props.dataInicio} - {props.dataFinal}</div>            
            </section>        
        </div>
    )
}

export default ManutencaoComponent;