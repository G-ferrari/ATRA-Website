# Postgres do site, com a extensão pgvector (D-73, a busca da ATRA AI).
#
# ⚠️ Compilado sobre a **mesma** `postgres:17-alpine` que já guarda os dados, e
# não trocado pela `pgvector/pgvector:pg17`. Aquela é Debian: a ordenação de
# texto do glibc difere da do musl, e o volume de produção, criado no Alpine,
# ficaria com os índices de texto (slug, e-mail) numa ordem que o banco novo
# não reconhece — busca por slug falhando sem erro até um REINDEX. Aqui o
# sistema não muda; só entra o `vector.so`.
#
# A versão fica presa: extensão nova pede `ALTER EXTENSION vector UPDATE`, e
# isso é migração, não efeito colateral de rebuild.
FROM postgres:17-alpine

ARG PGVECTOR_VERSION=v0.8.1

# `with_llvm=no`: a imagem oficial foi compilada com JIT, e o `make` tentaria
# gerar o bitcode com a versão exata do clang dela. Sem o bitcode a extensão
# funciona igual; só a expressão que usa vetor não ganha JIT.
RUN apk add --no-cache --virtual .build-deps git build-base \
 && git clone --depth 1 --branch "$PGVECTOR_VERSION" https://github.com/pgvector/pgvector.git /tmp/pgvector \
 && cd /tmp/pgvector \
 && make with_llvm=no OPTFLAGS="" \
 && make with_llvm=no install \
 && cd / && rm -rf /tmp/pgvector \
 && apk del .build-deps
