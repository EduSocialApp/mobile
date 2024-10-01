import axios from 'axios'

interface CepDetails {
    cep: string
    logradouro: string
    complemento: string
    bairro: string
    localidade: string
    uf: string
    ibge: string
    gia: string
    ddd: string
    siafi: string
}

export async function cepScan(cep: string): Promise<CepDetails> {
    if (!cep) throw new Error('CEP is required')

    cep = cep.replace(/\D/g, '')

    try {
        const { data } = await axios.get<CepDetails>(`https://viacep.com.br/ws/${cep}/json/`)

        if (!data) throw new Error('CEP not found')

        return data
    } catch {
        throw new Error('CEP not found')
    }
}
