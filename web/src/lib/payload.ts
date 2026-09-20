import configPromise from '@payload-config'
import { getPayload as getPayloadInstance } from 'payload'

/** Instância do Payload para consulta no servidor. O próprio Payload já
 *  memoiza por processo; este wrapper só evita repetir o import da config. */
export const getPayload = async () => getPayloadInstance({ config: configPromise })
