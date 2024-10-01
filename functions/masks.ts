import IMask from 'imask'

export function maskCpfCnpj(value: string): string {
    const pattern = value.replace(/\D/g, '').length > 11 ? '00.000.000/0000-00' : '000.000.000-00'

    const mask = IMask.createMask({
        mask: pattern,
    })

    mask.resolve(value)

    return mask.value
}

export function maskCep(value: string): string {
    const mask = IMask.createMask({
        mask: '00000-000',
    })

    mask.resolve(value)

    return mask.value
}

export function maskCnpj(value: string): string {
    const mask = IMask.createMask({
        mask: '00.000.000/0000-00',
    })

    mask.resolve(value)

    return mask.value
}
