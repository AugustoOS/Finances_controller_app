# The backup file

Everything the app knows lives in one JSON object, kept in the browser's `localStorage` under the key `finances.v1` and written out as a file whenever you ask for it. **No copy of anyone's data is stored in this repository** — what sits on GitHub is the app and this description of its format.

## Saving and restoring

In **Ajustes**:

- **Salvar cópia em arquivo** downloads `finances-controller-YYYY-MM-DD.json`. Send it to yourself now and then.
- **Restaurar de um arquivo** takes one back, on this phone or a new one. It replaces everything currently stored.
- **Ver a cópia como texto** opens the same JSON in a text box, to copy and paste by hand. Use it when the browser refuses to download, which happens in some iOS home-screen apps.

Restoring a file written by an older build works. The old default income becomes the fixed income. A month that carried its own list of receipts keeps only the entries that were not part of the fixed list, which become that month's gains, along with any receipt you had marked by hand as received or not. Older still, when a month was a single number, whatever exceeded the fixed income becomes one gain called Complemento. Fields the old build never wrote simply come back empty.

## Format

```json
{
  "v": 4,
  "rendaModelo":  [ { "id": "f1", "nome": "Salário", "valor": 4500, "dia": 20 } ],
  "ganhos":       { "2026-09": [ { "id": "…", "nome": "Freela", "valor": 1200, "dia": 8 } ] },
  "recebidos":    { "2026-09|f1": true },
  "particoes":    [ { "id": "…", "nome": "Aluguel", "planejado": 2000, "cor": "#2E7D8F",
                      "parcelas": [ { "id": "…", "dia": 10, "valor": 1200 }, { "id": "…", "dia": 11, "valor": 800 } ] } ],
  "gastos":       { "2026-09": [ { "id": "…", "pid": "…", "valor": 347.8, "nota": "", "dia": "12/09", "parc": "…" },
                                 { "id": "…", "pid": null, "valor": 120, "nota": "livro", "dia": "28/09",
                                   "cartao": "ct1", "fatMes": "2026-10" } ] },
  "compras":      [ { "id": "…", "nome": "Micro-ondas", "preco": 699, "prio": 3, "compradoEm": null } ],
  "cartoes":      [ { "id": "ct1", "nome": "Nubank", "limite": 5000, "vencimento": 12, "cor": "#7A6BB5" } ],
  "comprasCartao":[ { "id": "…", "cartao": "ct1", "nome": "Geladeira", "total": 3000, "parcelas": 10,
                      "data": "2026-08-14", "inicio": "2026-08" } ],
  "faturas":      { "ct1|2026-08": true },
  "cofre":        { "pct": 20, "base": "sobra", "objetivo": { "nome": "Reserva", "valor": 10000 },
                    "movimentos": [ { "id": "…", "mes": "2026-09", "valor": 400, "nota": "reserva", "dia": "06/09" } ] },
  "prefs":        { "tema": "auto", "textoGrande": false, "abaInicial": "mes" },
  "renda":        { "2026-09": 5700 },
  "rendaPadrao":  4500
}
```

Months are always `YYYY-MM`, amounts are plain numbers in reais, and every `id` is an opaque string.

| Field | What it holds |
|---|---|
| `rendaModelo` | The fixed income: what arrives every month, on the same day. It applies to every month, and nothing overrides it. |
| `ganhos` | Money that landed in one month only, added on top of the fixed income. `recebido` is optional, and without it the gain counts as received once its day has passed. |
| `recebidos` | Per-month answer to "has this fixed receipt landed yet", keyed `month|fixedId`. Absent means the app decides by the day. |
| `particoes` | The envelopes. `parcelas` are the due dates: a day and an amount each. With parcels present, `planejado` is their sum. |
| `gastos` | Expenses per month. `pid` is the envelope id and `null` means loose spending. `parc` ties the expense to one due date, which is what marks that parcel as paid. `cartao` is a card id when the expense was paid on credit: the money then leaves with that card's bill instead of now, and `fatMes` says which bill it lands on, the month it happened or the next one. An expense with no `cartao` is cash, pix or debit. |
| `compras` | The Casa shopping list. `prio` runs from 1 (can wait) to 3 (high), and `compradoEm` is the month it was bought. |
| `cartoes` | The cards. `vencimento` is the day the bill falls due. |
| `comprasCartao` | Card purchases. `data` is the day it was bought, `YYYY-MM-DD`, and `inicio` is the month of the first instalment, normally the same month or the next one. Instalments for later months are derived from `inicio`, and the cents of the last one absorb the rounding. A purchase saved by an older build has no `data`, and the first day of `inicio` stands in for it. |
| `faturas` | One key per settled bill, `cardId|month`, always `true`. A bill missing from here is still open, and its instalments still hold limit. |
| `cofre` | The piggy bank. `base` is `sobra` or `renda`, `pct` is the share to set aside, and a negative entry in `movimentos` is a withdrawal. An entry whose `mes` is `inicial` is a balance carried over from months that were pruned. |
| `prefs` | Appearance: `tema` is `auto`, `claro` or `escuro`; `textoGrande` is a boolean; `abaInicial` is the tab the app opens on. Travels with the backup so a new phone looks the same. |
| `renda`, `rendaPadrao` | Written only so an older build can still read the file. The app itself ignores them; `rendaModelo` and `ganhos` are the source. |

## An empty one

Restoring this resets the app to a clean state, which is also what a fresh install starts from:

```json
{
  "v": 4,
  "rendaModelo": [],
  "ganhos": {},
  "recebidos": {},
  "particoes": [],
  "gastos": {},
  "compras": [],
  "cartoes": [],
  "comprasCartao": [],
  "faturas": {},
  "cofre": { "pct": 20, "base": "sobra", "objetivo": { "nome": "", "valor": 0 }, "movimentos": [] },
  "prefs": { "tema": "auto", "textoGrande": false, "abaInicial": "mes" },
  "renda": {},
  "rendaPadrao": 0
}
```

## Size

The file is one line of JSON with no whitespace, and the browser stores it as UTF-16, so it costs two bytes per character. Roughly 5 KB per month of ordinary use, which puts a full year at about 60 KB of text and 120 KB of browser storage, against a budget of some 5 MB. **Ajustes** shows the current size and offers to drop anything older than the last twelve months.
