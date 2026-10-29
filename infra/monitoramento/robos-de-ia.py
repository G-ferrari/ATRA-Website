#!/usr/bin/env python3
"""Conta as visitas dos robôs de IA no log de acesso do Caddy (GEO, D-80).

O Google Analytics não vê robô: ele roda no navegador, e robô não executa o
script. O único lugar onde a visita do GPTBot ou do PerplexityBot aparece é o
log de acesso do Caddy, que já é gravado em JSON no host (`Caddyfile`,
`log_de_acesso`). Este script lê esse log e responde três perguntas: quais
robôs vêm, quantas vezes por dia, e o que eles leem.

Uso, na VM, a partir da raiz do deploy:

    python3 infra/monitoramento/robos-de-ia.py logs/caddy/access*.log*
    python3 infra/monitoramento/robos-de-ia.py --dias 7 --top 20 logs/caddy/access*.log*

Lê também os arquivos girados (`.gz`). Só a biblioteca padrão: a VM não precisa
de nada instalado.

⚠️ O nome no User-Agent se declara, não se prova: qualquer um escreve
"GPTBot". Para contagem de tendência serve; para decidir bloqueio, confira o IP
contra as faixas publicadas por cada empresa (OpenAI e Perplexity publicam).
"""

from __future__ import annotations

import argparse
import gzip
import json
import sys
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone

# Nome no User-Agent → para que serve. Fontes: a documentação de cada empresa
# (OpenAI "Overview of OpenAI Crawlers", Perplexity "Perplexity Crawlers").
ROBOS = {
    'OAI-SearchBot': 'ChatGPT, busca',
    'ChatGPT-User': 'ChatGPT, visita pedida pelo usuário',
    'GPTBot': 'OpenAI, treino',
    'PerplexityBot': 'Perplexity, busca',
    'Perplexity-User': 'Perplexity, visita pedida pelo usuário',
    'Claude-SearchBot': 'Claude, busca',
    'Claude-User': 'Claude, visita pedida pelo usuário',
    'ClaudeBot': 'Anthropic, treino',
    'bingbot': 'Bing e Copilot',
    'Googlebot': 'Google (busca e AI Overviews)',
    'Applebot': 'Apple',
    'Amazonbot': 'Amazon',
    'meta-externalagent': 'Meta',
    'DuckAssistBot': 'DuckDuckGo',
    'CCBot': 'Common Crawl',
    'Bytespider': 'ByteDance',
}


def abrir(caminho: str):
    return gzip.open(caminho, 'rt', encoding='utf-8', errors='replace') if caminho.endswith('.gz') else open(
        caminho, encoding='utf-8', errors='replace'
    )


def robo_de(user_agent: str) -> str | None:
    ua = user_agent.lower()
    # A ordem do dicionário importa: `ChatGPT-User` antes de `GPTBot` não
    # colide, mas `Claude-User` contém "Claude" e `ClaudeBot` não — por isso a
    # busca é pelo nome inteiro, não por prefixo.
    for nome in ROBOS:
        if nome.lower() in ua:
            return nome
    return None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    parser.add_argument('arquivos', nargs='+', help='logs de acesso do Caddy (JSON, um por linha; .gz também)')
    parser.add_argument('--dias', type=int, default=30, help='janela, em dias até hoje (padrão: 30)')
    parser.add_argument('--top', type=int, default=10, help='quantas páginas listar por robô (padrão: 10)')
    args = parser.parse_args()

    desde = datetime.now(timezone.utc) - timedelta(days=args.dias)
    por_robo: Counter[str] = Counter()
    por_dia: dict[str, Counter[str]] = defaultdict(Counter)
    paginas: dict[str, Counter[str]] = defaultdict(Counter)
    erros: Counter[str] = Counter()

    for caminho in args.arquivos:
        try:
            arquivo = abrir(caminho)
        except OSError as e:
            print(f'[aviso] {caminho}: {e}', file=sys.stderr)
            continue
        with arquivo:
            for linha in arquivo:
                try:
                    evento = json.loads(linha)
                    pedido = evento['request']
                    quando = datetime.fromtimestamp(float(evento['ts']), timezone.utc)
                except (ValueError, KeyError, TypeError):
                    continue
                if quando < desde:
                    continue
                ua = ' '.join(pedido.get('headers', {}).get('User-Agent', []))
                robo = robo_de(ua)
                if not robo:
                    continue
                por_robo[robo] += 1
                por_dia[quando.strftime('%Y-%m-%d')][robo] += 1
                paginas[robo][pedido.get('uri', '?').split('?')[0]] += 1
                if int(evento.get('status', 0)) >= 400:
                    erros[robo] += 1

    if not por_robo:
        print(f'Nenhuma visita de robô de IA nos últimos {args.dias} dias.')
        return 0

    print(f'Visitas de robôs nos últimos {args.dias} dias\n')
    print(f'{"Robô":<20} {"Para quê":<40} {"Visitas":>8} {"Erros":>6}')
    for robo, total in por_robo.most_common():
        print(f'{robo:<20} {ROBOS[robo]:<40} {total:>8} {erros[robo]:>6}')

    print('\nPor dia (todos os robôs)')
    for dia in sorted(por_dia):
        print(f'  {dia}  {sum(por_dia[dia].values()):>6}')

    for robo, _ in por_robo.most_common():
        print(f'\nO que {robo} mais leu')
        for pagina, n in paginas[robo].most_common(args.top):
            print(f'  {n:>6}  {pagina}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
