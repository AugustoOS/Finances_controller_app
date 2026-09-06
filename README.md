# Repartição

App de bolso pra repartir o salário do mês e saber, a qualquer momento, quanto ainda dá pra gastar sem furar as contas.

Roda no navegador, sem backend, sem conta, sem nuvem. Instalado na tela de início do celular, funciona offline e parece um app nativo.

---

## A ideia

O dinheiro do mês é dividido em **repartições** — uma faixa pra cada conta que se repete: aluguel, mercado, Uber, luz, internet, gás. Cada faixa reserva o valor que você planejou gastar nela.

O que não foi reservado é a **sobra**: o número grande da primeira tela, e a única pergunta que o app existe pra responder.

A regra do cálculo:

```
comprometido = Σ max(planejado, gasto real) de cada repartição
sobra        = renda do mês − comprometido − gastos avulsos
```

Usar `max(planejado, gasto)` é o detalhe que faz a conta ser honesta: enquanto você está dentro do planejado, a faixa segura o valor cheio (a conta ainda vai chegar). Se estourar, ela passa a comprometer o que realmente saiu, e a sobra encolhe na hora.

---

## As telas

| Tela | Pra quê |
|---|---|
| **Mês** | A sobra, a régua colorida mostrando pra onde o salário foi, quanto já saiu, quanto ainda vai sair e quanto dá por dia até o mês fechar. |
| **Repartições** | Uma faixa por conta, com barra de preenchimento. Toque pra lançar um gasto, ajustar o planejado, trocar a cor ou ver os lançamentos do mês. |
| **Casa** | Lista de compras da casa. Cada item mostra `cabe` ou `faltam R$ X` comparando com a sobra atual. Marcar como comprado lança o valor como gasto do mês. |
| **Ajustes** | Renda do mês, renda padrão, cópia de segurança e limpeza. |

O seletor `‹ mês ›` no topo navega entre os meses. As repartições são as mesmas em todos; o que muda de um mês pro outro são os lançamentos e a renda.

---

## Instalação no GitHub Pages

1. Crie um repositório e suba o conteúdo do pacote na raiz (`index.html`, `manifest.webmanifest`, `sw.js` e os `icon-*.png`).
2. **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
3. Em cerca de um minuto a URL fica no ar: `https://<usuario>.github.io/<repo>/`.
4. Abra essa URL **no Safari** (no iPhone tem que ser o Safari) → botão Compartilhar → **Adicionar à Tela de Início**.

Depois da primeira abertura o service worker guarda tudo em cache e o app abre sem internet.

### Atualizando o app

Substitua `index.html` e suba um `CACHE` novo em `sw.js` (`reparticao-v1` → `reparticao-v2`). Sem trocar o nome do cache, o service worker continua servindo a versão antiga. Depois de publicar, feche e reabra o app duas vezes.

---

## Onde ficam os dados

No `localStorage` do navegador, atrelado à URL do Pages, na chave `reparticao.v1`. Nada sai do aparelho e nada é gravado nos arquivos do repositório — o que está no GitHub é só o app.

Na prática:

- Fechar o app, ficar semanas sem abrir, modo avião: os dados continuam lá.
- Outro aparelho abrindo a mesma URL começa zerado. Não sincroniza.
- Limpar dados de sites do Safari apaga tudo junto.

Por isso existe a caixa de **cópia de segurança** em Ajustes: o texto ali é o seu histórico inteiro em JSON. Copie de vez em quando e mande pra você mesmo. Pra restaurar (ou migrar de aparelho), cole o texto no lugar e toque em Restaurar.

### Formato do backup

```json
{
  "renda":       { "2026-09": 6500 },
  "rendaPadrao": 6500,
  "particoes":   [ { "id": "…", "nome": "Mercado", "planejado": 900, "cor": "#2E7D8F" } ],
  "gastos":      { "2026-09": [ { "id": "…", "pid": "…", "valor": 347.8, "nota": "", "dia": "12/09" } ] },
  "compras":     [ { "id": "…", "nome": "Micro-ondas", "preco": 699, "prio": 3, "compradoEm": null } ]
}
```

`pid` é o id da repartição; `null` significa gasto avulso. `prio` vai de 1 (pode esperar) a 3 (alta).

---

## Arquivos

```
index.html              app inteiro — HTML, CSS e JS em um arquivo só, sem dependências
manifest.webmanifest    nome, ícones e modo standalone
sw.js                   service worker, cache-first, pro app abrir offline
icon-180.png            atalho da tela de início (iOS)
icon-192/512.png        ícones do manifest
icon-512-maskable.png   ícone adaptativo (Android)
```

Sem build, sem `npm install`, sem framework. Editar é abrir o `index.html`.

---

## Limitações conhecidas

- Um aparelho só. Migração é via backup manual.
- Não separa cartão de crédito por fatura — um gasto no crédito entra no mês em que foi lançado, não no mês do vencimento.
- Não tem categoria de receita variável dentro do mês: entrou dinheiro extra, você ajusta a renda do mês na mão.
- Recorrência é implícita: as repartições se repetem, os lançamentos não. Todo mês você lança de novo.
