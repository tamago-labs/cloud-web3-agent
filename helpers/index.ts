

export const shortAddress = (address: string, first = 6, last = -4) => {
    if (!address) return ''
    return `${address.slice(0, first)}...${address.slice(last)}`
}
