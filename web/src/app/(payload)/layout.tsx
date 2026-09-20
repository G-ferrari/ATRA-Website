/* Casca do admin do Payload. Gerado a partir dos exports de
 * @payloadcms/next@3.88 — não editar à mão sem conferir o pacote instalado. */
import type { ServerFunctionClient } from 'payload'

import config from '@payload-config'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'

/* CSS do admin já compilado pelo pacote. O SCSS que o RootLayout importa de
 * dentro de node_modules não é processado pelo Turbopack, então sem este
 * import o painel renderiza sem estilo nenhum. */
import '@payloadcms/next/css'
import './custom.scss'

type Args = { children: React.ReactNode }

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
