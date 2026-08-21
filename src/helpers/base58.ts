const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const BASE = 58
const LEADER = ALPHABET[0]
const FACTOR = Math.log(256) / Math.log(BASE)
const IFACTOR = Math.log(BASE) / Math.log(256)

const MAP = new Int16Array(128).fill(-1)
for (let i = 0; i < ALPHABET.length; i++) {
  MAP[ALPHABET.charCodeAt(i)] = i
}

/** Bitcoin/Hive base58 encode. */
export const encode = (source: Uint8Array): string => {
  if (source.length === 0) return ''

  let zeroes = 0
  let length = 0
  let pbegin = 0
  const pend = source.length
  while (pbegin !== pend && source[pbegin] === 0) {
    pbegin++
    zeroes++
  }

  const size = ((pend - pbegin) * FACTOR + 1) >>> 0
  const b58 = new Uint8Array(size)

  while (pbegin !== pend) {
    let carry = source[pbegin]
    let i = 0
    for (let it = size - 1; (carry !== 0 || i < length) && it !== -1; it--, i++) {
      carry += (256 * b58[it]) >>> 0
      b58[it] = (carry % BASE) >>> 0
      carry = (carry / BASE) >>> 0
    }
    if (carry !== 0) throw new Error('Non-zero carry')
    length = i
    pbegin++
  }

  let it = size - length
  while (it !== size && b58[it] === 0) it++

  let str = LEADER.repeat(zeroes)
  for (; it < size; ++it) str += ALPHABET.charAt(b58[it])
  return str
}

/** Bitcoin/Hive base58 decode. */
export const decode = (source: string): Uint8Array => {
  if (source.length === 0) return new Uint8Array()

  let psz = 0
  let zeroes = 0
  let length = 0
  while (source[psz] === LEADER) {
    zeroes++
    psz++
  }

  const size = ((source.length - psz) * IFACTOR + 1) >>> 0
  const b256 = new Uint8Array(size)

  while (psz < source.length) {
    const ch = source.charCodeAt(psz)
    const digit = ch < 128 ? MAP[ch] : -1
    if (digit === -1) throw new Error(`Non-base58 character: ${JSON.stringify(source[psz])}`)

    let carry = digit
    let i = 0
    for (let it = size - 1; (carry !== 0 || i < length) && it !== -1; it--, i++) {
      carry += (BASE * b256[it]) >>> 0
      b256[it] = (carry % 256) >>> 0
      carry = (carry / 256) >>> 0
    }
    if (carry !== 0) throw new Error('Non-zero carry')
    length = i
    psz++
  }

  let it = size - length
  while (it !== size && b256[it] === 0) it++

  const out = new Uint8Array(zeroes + (size - it))
  let j = zeroes
  while (it !== size) out[j++] = b256[it++]
  return out
}
