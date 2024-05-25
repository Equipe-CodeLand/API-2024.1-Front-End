import { URI } from "../enumeracoes/uri"
import Buscador from "./buscador"

export default class BuscadorArquivos implements Buscador {
    public async buscar() {
        let json = await fetch(URI.ARQUIVO).then(resposta => resposta.json())
        return json
    }
}