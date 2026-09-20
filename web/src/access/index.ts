import type { Access, FieldAccess } from 'payload'

/* Controle de acesso (D-18). Dois papéis: `editor` e `admin`.
 *
 * Toda collection precisa declarar `access` explicitamente — sem declaração o
 * Payload libera para qualquer usuário autenticado, que é justamente o que
 * queremos evitar nos globals e no prompt da IA. */

export const isAdmin: Access = ({ req: { user } }) => user?.role === 'admin'

export const isEditorOrAdmin: Access = ({ req: { user } }) => Boolean(user)

export const isPublic: Access = () => true

/** Nível de campo: impede que um editor se promova editando o próprio perfil. */
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => user?.role === 'admin'
