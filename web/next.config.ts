import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Turbopack é o padrão no Next 16 — não precisa de flag.
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
