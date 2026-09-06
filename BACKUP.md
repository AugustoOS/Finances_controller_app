# The backup file

Everything the app knows lives in one JSON object, kept in the browser's `localStorage` under the key `finances.v1` and written out as a file whenever you ask for it. **No copy of anyone's data is stored in this repository** — what sits on GitHub is the app and this description of its format.

## Saving and restoring

In **Ajustes**:

- **Salvar cópia em arquivo** downloads `finances-controller-YYYY-MM-DD.json`. Send it to yourself now and then.
- **Restaurar de um arquivo** takes one back, on this phone or a new one. It replaces everything currently stored.
- **Ver a cópia como texto** opens the same JSON in a text box, to copy and paste by hand. Use it when the browser refuses to download, which happens in some iOS home-screen apps.

Restoring a file written by an older build works: a month's plain income number becomes one receipt on day 5, and the old default income becomes the fixed model. Fields the old build never wrote simply come back empty.

## Format

```json
{
  "v": 3,
  "rendas":       { "2026-09": [ { "id": "…", "nome": "Salário", "valor": 4500, "dia": 20, "recebido": true } ] },
  "rendaModelo":  [ { "id": "…", "nome": "Salário", "valor": 4500, "dia": 20 } ],
  "particoes":    [ { "id": "…", "nome": "Aluguel", "planejado": 2000, "cor": "#2E7D8F",
                      "parcelas": [ { "id": "…", "dia": 10, "valor": 1200 }, { "id": "…", "dia": 11, "valor": 800 } ] } ],
  "gastos":       { "2026-09": [ { "id": "…", "pid": "…", "valor": 347.8, "nota": "", "dia": "12/09", "parc": "…" } ] },
  "compras":      [ { "id": "…", "nome": "Micro-ondas", "preco": 699, "prio": 3, "compradoEm": null } ],
  "cartoes":      [ { "id": "ct1", "nome": "Nubank", "limite": 5000, "vencimento": 12, "cor": "#7A6BB5" } ],
  "comprasCartao":[ { "id": "…", "cartao": "ct1", "nome": "Geladeira", "total": 3000, "parcelas": 10, "inicio": "2026-08" } ],
  "faturas":      { "ct1|2026-08": true },
  "cofre":        { "pct": 20, "base": "sobra", "objetivo": { "nome": "Reserva", "valor": 10000 },
                    "movimentos": [ { "id": "…", "mes": "2026-09", "valor": 400, "nota": "reserva", "dia": "06/09" } ] },
  "renda":        { "2026-09": 4500 },
  "rendaPadrao":  4500
}
```

Months are always `YYYY-MM`, amounts are plain numbers in reais, and every `id` is an opaque string.

| Field | What it holds |
|---|---|
| `rendas` | Receipts per month. A month listed here has its own list and ignores `rendaModelo`; a month absent from it follows the model. `recebido` is optional, and without it the receipt counts as received once its day has passed. |
| `rendaModelo` | The receipts that repeat, used by every month that has no list of its own. |
| `particoes` | The envelopes. `parcelas` are the due dates: a day and an amount each. With parcels present, `planejado` is their sum. |
| `gastos` | Expenses per month. `pid` is the envelope id and `null` means loose spending. `parc` ties the expense to one due date, which is what marks that parcel as paid. |
| `compras` | The Casa shopping list. `prio` runs from 1 (can wait) to 3 (high), and `compradoEm` is the month it was bought. |
| `cartoes` | The cards. `vencimento` is the day the bill falls due. |
| `comprasCartao` | Card purchases. `inicio` is the month of the first instalment; the instalment for any later month is derived from it, and the cents of the last one absorb the rounding. |
| `faturas` | One key per settled bill, `cardId|month`, always `true`. A bill missing from here is still open, and its instalments still hold limit. |
| `cofre` | The piggy bank. `base` is `sobra` or `renda`, `pct` is the share to set aside, and a negative entry in `movimentos` is a withdrawal. An entry whose `mes` is `inicial` is a balance carried over from months that were pruned. |
| `renda`, `rendaPadrao` | Written only so an older build can still read the file. The app itself ignores them when `rendas` is present. |

## An empty one

Restoring this resets the app to a clean state, which is also what a fresh install starts from:

```json
{
  "v": 3,
  "rendas": {},
  "rendaModelo": [],
  "particoes": [],
  "gastos": {},
  "compras": [],
  "cartoes": [],
  "comprasCartao": [],
  "faturas": {},
  "cofre": { "pct": 20, "base": "sobra", "objetivo": { "nome": "", "valor": 0 }, "movimentos": [] },
  "renda": {},
  "rendaPadrao": 0
}
```

## Size

The file is one line of JSON with no whitespace, and the browser stores it as UTF-16, so it costs two bytes per character. Roughly 5 KB per month of ordinary use, which puts a full year at about 60 KB of text and 120 KB of browser storage, against a budget of some 5 MB. **Ajustes** shows the current size and offers to drop anything older than the last twelve months.
