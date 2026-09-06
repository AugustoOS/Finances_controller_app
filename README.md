# Finances controller

**A pocket budget that answers one question: how much can I actually spend right now?**

A single-file web app that splits your monthly income into envelopes — rent, groceries, rides, power, internet — and keeps a running total of what is genuinely free to spend. No backend, no account, no cloud. Added to your phone's home screen it runs offline and behaves like a native app.

---

## The idea

Money is divided into **repartições** (envelopes). Each one reserves the amount you planned to spend on a recurring bill. Whatever is not reserved is the **leftover** — the big number on the first screen, and the only question this app exists to answer.

```
committed = Σ max(planned, actual) for every envelope
leftover  = monthly income − committed − loose spending
```

The `max(planned, actual)` is the part that keeps the number honest. While you are still under budget, the envelope holds back the full planned amount, because the bill has not arrived yet. The moment you overshoot, it commits what actually left your account instead, and the leftover shrinks immediately.

---

## Screens

| Screen | What it does |
|---|---|
| **Mês** (Month) | The leftover, a stacked bar showing where the salary went, what has already left, what is still coming, and how much per day until the month closes. |
| **Repartições** (Envelopes) | One row per bill with a fill bar. Tap to log an expense, adjust the planned amount, change the colour, or review this month's entries. |
| **Casa** (Home) | A shopping list for the apartment. Each item is tagged `cabe` (fits) or `faltam R$ X` (short by X) against the current leftover. Marking one as bought logs it as spending for the month. |
| **Ajustes** (Settings) | Monthly income, default income, backup and reset. |

The `‹ month ›` selector at the top moves between months. Envelopes carry over unchanged; only the entries and the income differ month to month.

The interface is in Brazilian Portuguese.

---

## Deploying to GitHub Pages

1. Create a repository and put the package contents at the root: `index.html`, `manifest.webmanifest`, `sw.js` and the `icon-*.png` files.
2. **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
3. After about a minute the URL is live at `https://<user>.github.io/<repo>/`.
4. Open it **in Safari** (it has to be Safari on iOS) → Share → **Add to Home Screen**.

After the first load the service worker caches everything and the app opens without a connection.

### Shipping an update

Replace `index.html` and bump the cache name in `sw.js` (`reparticao-v1` → `reparticao-v2`). Without a new cache name the service worker keeps serving the old build. Once it is published, close and reopen the app twice.

---

## Where the data lives

In the browser's `localStorage`, scoped to the Pages URL, under the key `reparticao.v1`. Nothing leaves the device and nothing is written back to the repository — what sits on GitHub is only the app itself.

In practice:

- Close the app, ignore it for weeks, fly in airplane mode: the data is still there.
- Another device on the same URL starts empty. There is no sync.
- Clearing Safari's website data wipes it along with everything else.

That is why **Ajustes** carries a backup box: the text in it is your entire history as JSON. Copy it now and then and send it to yourself. To restore it — or to move to another phone — paste the text back and tap Restaurar.

### Backup format

```json
{
  "renda":       { "2026-09": 6500 },
  "rendaPadrao": 6500,
  "particoes":   [ { "id": "…", "nome": "Mercado", "planejado": 900, "cor": "#2E7D8F" } ],
  "gastos":      { "2026-09": [ { "id": "…", "pid": "…", "valor": 347.8, "nota": "", "dia": "12/09" } ] },
  "compras":     [ { "id": "…", "nome": "Micro-ondas", "preco": 699, "prio": 3, "compradoEm": null } ]
}
```

`pid` is the envelope id; `null` marks loose spending. `prio` runs from 1 (can wait) to 3 (high).

---

## Files

```
index.html              the whole app — HTML, CSS and JS in one file, no dependencies
manifest.webmanifest    name, icons, standalone display mode
sw.js                   cache-first service worker, so the app opens offline
icon-180.png            home screen shortcut (iOS)
icon-192/512.png        manifest icons
icon-512-maskable.png   adaptive icon (Android)
```

No build step, no `npm install`, no framework. Editing means opening `index.html`.

---

## Known limits

- One device only. Moving between phones is a manual backup and restore.
- Credit card purchases are not split by statement — an expense lands in the month it was logged, not the month the bill is due.
- No variable income inside the month: if extra money comes in, you edit the month's income by hand.
- Recurrence is implicit. Envelopes repeat, entries do not — you log them again every month.
