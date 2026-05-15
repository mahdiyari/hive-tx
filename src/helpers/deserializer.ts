import { ByteBuffer } from './ByteBuffer.js'
import { PublicKey } from './PublicKey.js'

const PublicKeyDeserializer = (buf: ByteBuffer) => {
  const c = fixedBuf(buf, 33)
  return new PublicKey(c)
}

const UInt64Deserializer = (b: ByteBuffer) => {
  return b.readUint64()
}

const UInt32Deserializer = (b: ByteBuffer) => {
  return b.readUint32()
}

const BinaryDeserializer = (b: ByteBuffer) => {
  const len = <number>b.readVarint32()
  const bCopy = b.copy(b.offset, b.offset + len)
  b.skip(len)
  return new Uint8Array(bCopy.toBuffer())
}

const BufferDeserializer = (keyDeserializers: any) => (buf: Uint8Array) => {
  const obj: any = {}
  const buffer = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN)
  buffer.append(buf)
  buffer.flip()
  for (const [key, deserializer] of keyDeserializers) {
    try {
      obj[key] = deserializer(buffer)
    } catch (error: any) {
      error.message = `${key}: ${error.message}`
      throw error
    }
  }
  return obj
}

function fixedBuf(b: ByteBuffer, len: number) {
  if (!b) {
    throw Error('No buffer found on first parameter')
  } else {
    const bCopy = b.copy(b.offset, b.offset + len)
    b.skip(len)
    return new Uint8Array(bCopy.toBuffer())
  }
}

const EncryptedMemoDeserializer = BufferDeserializer([
  ['from', PublicKeyDeserializer],
  ['to', PublicKeyDeserializer],
  ['nonce', UInt64Deserializer],
  ['check', UInt32Deserializer],
  ['encrypted', BinaryDeserializer]
])

export const Deserializer = {
  Memo: EncryptedMemoDeserializer
}
