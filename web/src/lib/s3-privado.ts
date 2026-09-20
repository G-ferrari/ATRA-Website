import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

/* URL pré-assinada para o bucket privado (MIG-104).
 *
 * A assinatura fala S3 direto — MinIO em dev, o mesmo endpoint em produção até
 * o R2 (deploy-vps.md). O arquivo nunca passa pelo Payload nem pelo Next: o
 * visitante baixa do storage, com uma URL que expira sozinha.
 *
 * ⚠️ 15 minutos, e é escolha: o link vai para quem acabou de preencher o
 * formulário, não para circular. Link de material gated que dura para sempre é
 * material que deixou de ser gated no primeiro compartilhamento.
 */
const EXPIRA_EM_SEGUNDOS = 15 * 60

/* ⚠️ Endpoint PÚBLICO, não o interno. A primeira prova no staging pegou:
 * assinar com `S3_ENDPOINT` (http://minio:9000, hostname da rede do compose)
 * gera uma URL que o navegador do visitante não resolve. `S3_PUBLIC_ENDPOINT`
 * é o que o mundo alcança — no staging, o próprio site, com o Caddy roteando
 * `/atra-privado/*` até o MinIO. A assinatura cobre o Host, então os dois
 * lados precisam falar do mesmo nome. Sem a variável (dev nativo), cai no
 * S3_ENDPOINT, que ali é localhost e o browser alcança. */
const cliente = new S3Client({
  endpoint: process.env.S3_PUBLIC_ENDPOINT || process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  },
  forcePathStyle: true,
})

export async function urlAssinadaDoPrivado(filename: string): Promise<string> {
  return getSignedUrl(
    cliente,
    new GetObjectCommand({
      Bucket: process.env.S3_PRIVATE_BUCKET || 'atra-privado',
      Key: filename,
      /* O browser baixa em vez de tentar renderizar — é um PDF de material. */
      ResponseContentDisposition: `attachment; filename="${filename.replace(/"/g, '')}"`,
    }),
    { expiresIn: EXPIRA_EM_SEGUNDOS },
  )
}
