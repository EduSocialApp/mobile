import axios from 'axios'

interface CnpjDetails {
    cnpj_raiz: string
    razao_social: string
    estabelecimento: {
        cnpj: string
        nome_fantasia?: string
        situacao_cadastral: string
        logradouro: string
        numero: string
        complemento?: string
        bairro: string
        cep: string
        ddd1: string
        telefone1: string
        email: string
        estado: {
            id: number
            nome: string
            sigla: string
            ibge_id: number
        }
        cidade: {
            id: number
            nome: string
            ibge_id: number
            siafi_id: string
        }
    }
}

export async function cnpjScan(cnpj: string): Promise<CnpjDetails> {
    if (!cnpj) throw new Error('CNPJ is required')

    cnpj = cnpj.replace(/\D/g, '')

    try {
        const { data } = await axios.get<CnpjDetails>(`https://publica.cnpj.ws/cnpj/${cnpj}`)

        if (!data) throw new Error('CNPJ not found')

        return data
    } catch {
        throw new Error('CNPJ not found')
    }
}
