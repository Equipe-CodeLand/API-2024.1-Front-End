import ManutencaoComponent from "./manutencaoComponent"

export default function ManutencaoPage() {

    let manutencoes = [{id: 112151515, nome: 'Máquina de Impressão 3D Industrial', dataInicio: '28/03/2024', dataFinal: '05/04/2024'},
        {id: 2, nome: 'Máquina de Impressão 3D Industrial', dataInicio: '28/03/2024', dataFinal: '05/04/2024'},
        {id: 3, nome: 'Máquina de Impressão 3D Industrial', dataInicio: '28/03/2024', dataFinal: '05/04/2024'}]
    
    return(
        <div>
            {manutencoes.map(manutencao => {
                return <ManutencaoComponent
                    id={manutencao.id}
                    nome={manutencao.nome}
                    dataInicio={manutencao.dataInicio}
                    dataFinal={manutencao.dataFinal}
                ></ManutencaoComponent>
            })}
        </div>
    )
}