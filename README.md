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

## Dates on both sides

Income has two halves. **Renda fixa** is what arrives every month on the same day, one row per source, and it applies to every month there is, past or future. **Ganho deste mês** is money that landed once and will not repeat: a freelance job, a bonus, a sale. It is added on top of the fixed income and never leaves the month it was logged in.

Envelopes carry **vencimentos** the same way. A bill due on the 10th is one parcel; a bill you split between the 10th and the 11th is two parcels with a day and an amount each. When an envelope has parcels, its monthly planned amount becomes their sum, and marking a parcel as paid logs the expense against it.

With both sides dated, the app walks the month event by event and shows the balance projected after each one. A month that closes with money left over can still run dry on the 11th, and that is exactly the failure the monthly leftover alone can never show.

## The credit card

A card is a name, a total limit and the day its bill falls due. A purchase is what you bought, how much it cost and in how many instalments, and the app spreads it across the months from the first instalment onwards, splitting the cents so the parts always add back to the total.

From that it derives the three numbers a card actually needs:

- **This month's bill**, instalment by instalment, each one labelled `parcela 3 de 10`, with the card's due day and whether it has been settled.
- **The free limit**, which is the total minus every instalment still sitting in an unpaid bill. Marking a bill as paid gives that limit back, exactly like the real card.
- **What is still owed**, the sum of every instalment dated after this month and the month the last one lands.

Any expense, anywhere in the app, can be marked as paid on a card instead of in cash. That single choice decides *when* the money leaves: a cash expense leaves the account the moment you log it, while a card expense stays in the account and leaves with that card's bill. It still counts against its envelope, because the envelope tracks the category and not the payment method, and it still eats into the card's free limit. A second choice says which bill it lands on, this month's or the next one, which is how you handle buying after the card closed.

Instalments and card-paid expenses are counted exactly once. The envelopes already carry the card-paid expenses, so only the instalments of card purchases are added on top as a new commitment; the bill itself appears as its own line, showing what will leave through it.

Nothing goes on a card beyond its limit. A purchase, an edit to a purchase, or an expense marked as paid on a card is refused when it would exceed what is free, whether on its own or added to everything already committed there, and the refusal says how much is free and how much is missing. Paying a bill gives that space back. A card with no limit registered is not checked.

## The piggy bank

Set a percentage and the app turns it into an amount: by default a share of what is left after every bill, or a share of the income if you prefer to save off the top. The percentage is a tap to change, and the suggestion follows the month you are looking at.

Money you put in leaves the free-to-spend pool and accumulates across months. Taking it back out is a withdrawal in the month you make it. An optional goal turns the balance into a distance: how much is missing, and how many months it takes at the current rate.

---

## Screens

| Screen | What it does |
|---|---|
| **Mês** (Month) | The leftover, a stacked bar showing where the salary went, what has already come in, what is still coming, how much per day until the month closes, and the suggestions below it. The loose-spending line opens the month's list, where an entry can be corrected, moved into an envelope or deleted. |
| **Renda** (Income) | Everything that comes in, in one place: the month's total split into what has already landed and what has not, the fixed income and this month's gains as two editable lists, the last six months side by side, and the two buttons that add either kind. Reached from its own tab, from the month screen and from settings. |
| **Agenda** | Every income and every due date in day order, with the projected balance after each line. Overdue bills are flagged, and the header carries the cash on hand today. |
| **Repartições** (Envelopes) | One row per bill with a fill bar and its due days. Tap to log an expense, adjust the planned amount, edit the payment dates, mark a parcel as paid, change the colour, or review this month's entries. Each entry opens an editor where its value, name, day and envelope can be changed, or the entry deleted. |
| **Cartão** (Card) | One block per card: this month's bill, the instalments inside it, the free limit against the total, and every purchase on the card with how far along it is and what it still owes. Tap a purchase to change its value, its number of instalments or its starting month, and **Editar cartão** for the limit and due day. |
| **Cofre** (Piggy bank) | The accumulated balance, the goal if there is one, the percentage that defines how much to set aside, what that gives this month, and the deposits and withdrawals made, each of which opens for editing. |
| **Histórico** (History) | The twelve months ending on the one you are viewing: what came in, what went out and what was left in each, with the totals and the monthly average. Tap a month to open it. Reached from Mês or from Ajustes. |
| **Casa** (Home) | A shopping list for the apartment. Each item is tagged `cabe` (fits) or `faltam R$ X` (short by X) against the current leftover. Marking one as bought logs it as spending for the month. |
| **Ajustes** (Settings) | Appearance first: theme (automatic, light or dark), text size, and which tab the app opens on. Then income, the twelve-month history, backup, cleanup and reset, with the build version at the bottom. It is the last tab in the bar, and the gear in the top bar is a shortcut to it. |

On a phone the bar at the bottom scrolls sideways, the tab you are on is brought to the centre, and its icon sits on a soft pill. On a screen 900px or wider the same bar becomes a sidebar on the left with the app name at the top, the month arrows move next to the month name, the content is centred in the remaining space, and sheets open as centred windows instead of sliding up from the bottom. The `‹ month ›` selector at the top moves between months. Envelopes, cards and the piggy bank carry over unchanged; only the entries and the income differ month to month.

The **Renda** tab is where income lives; the month screen and settings both link to it. **Fixed income and gains never compete.** Editing the fixed income changes every month at once, and there is no per-month copy that could drift out of sync with it. A gain belongs to one month and nothing else. The only thing stored per month for a fixed receipt is whether it has already landed, which the app otherwise works out from the day. A gain that turns out to repeat can be promoted with **Passar para a renda fixa**.

The interface is in Brazilian Portuguese.

---

## What the app tells you

Below the numbers on **Mês** sits a short list of readings of the current month, ordered by urgency and capped at six. They are computed from the same data every time the screen renders, and each one names the amount and the move it implies:

- **Overspending.** How much is missing to close at zero, which envelope drifted the most, how much of it is loose spending, and which pending purchase would close the gap if postponed.
- **A hole in the cash flow.** The day the projected balance first goes negative, the bill that pushes it there, and when the next money arrives, so the choice is between moving the date and anticipating the income.
- **Bills.** Anything overdue and unpaid, anything due within three days, and the projected balance just before it.
- **Pace.** An envelope consuming faster than the month is passing, what it closes at if nothing changes, and the daily figure that keeps it inside the plan. Held back until a quarter of the month has gone by, so early noise does not extrapolate into a scare.
- **A planned amount that no longer matches reality.** The average of the last three months against what is reserved today.
- **Loose spending** past a fifth of the income, which usually means a missing envelope.
- **Purchases.** Which item on the Casa list fits the leftover right now, or how many months of saving the top one still needs.
- **The card.** A bill that is overdue, due within five days, or simply still open, with the cash projected just before it. A limit past 80% or fully consumed. A card eating more than a third of the income. The month an instalment plan ends and the amount it frees. Future instalments adding up to more than one month's income.
- **The piggy bank.** How much the chosen percentage gives this month and what the balance becomes if you set it aside. A month where you saved more than the budget could take, with the amount worth withdrawing. Distance to the goal at the current rate.

Every card ends with shortcuts to where the problem gets solved, and the set depends on the situation. An overspent month offers the envelope that drifted most, the loose-spending list, a withdrawal from the piggy bank when it has a balance, the shopping-list item worth postponing, a one-off gain, and the agenda. A cash gap on a given day offers the bill that causes it so its date can move, the next receipt so it can be marked as already landed, the piggy bank, and the agenda. A card bill offers marking it paid and the card itself. Shortcuts that would lead nowhere, such as withdrawing from an empty piggy bank, are not shown.

Reminders live inside the app. There are no push notifications, so nothing arrives when the app is closed.

---

## Deploying to GitHub Pages

1. Create a repository and put the package contents at the root: `index.html`, `manifest.webmanifest`, `sw.js` and the `icon-*.png` files.
2. **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
3. After about a minute the URL is live at `https://<user>.github.io/<repo>/`.
4. Open it **in Safari** (it has to be Safari on iOS) → Share → **Add to Home Screen**.

After the first load the service worker caches everything and the app opens without a connection.

### Shipping an update

Replace `index.html` and push. The service worker fetches the app shell from the network on every open and only falls back to its cache when there is no connection, so a new build shows up on the next launch without touching `sw.js`. Bump `BUILD` near the top of the script when you ship, since that stamp is what **Ajustes** shows at the bottom and it is the quickest way to confirm a phone is running the version you think it is. The cache name in `sw.js` only needs to change when the list of cached files changes. On `localhost`, `127.0.0.1` or a file opened directly, the app does not register the service worker at all and removes any registration it finds, so a local server such as Live Server always shows the file as saved.

---

## Where the data lives

In the browser's `localStorage`, scoped to the Pages URL, under the key `finances.v1`. A phone still holding data from the first build, which used `reparticao.v1`, is picked up once on the next open and written back under the new key. Nothing leaves the device and nothing is written back to the repository — what sits on GitHub is only the app itself.

In practice:

- Close the app, ignore it for weeks, fly in airplane mode: the data is still there.
- Another device on the same URL starts empty. There is no sync.
- Clearing Safari's website data wipes it along with everything else.

**Ajustes** saves your whole history to a file: `Salvar cópia em arquivo` writes `finances-controller-YYYY-MM-DD.json` to the phone's downloads, and `Restaurar de um arquivo` reads one back, on this device or on a new one. A copy-and-paste text box is still there behind `Ver a cópia como texto`, for the odd browser that refuses the download.

The format of that file, and an empty one to start from, are in [BACKUP.md](BACKUP.md). No copy of your data lives in this repository.

### How much space it takes

The whole history is one JSON string, and browsers store it as UTF-16, so it costs two bytes per character. Measured on generated data:

| Kept | Text | In the browser | Of a 5 MB budget |
|---|---|---|---|
| 1 month, 60 expenses | 7 KB | 15 KB | 0.3% |
| 12 months, 30 expenses/month | 34 KB | 69 KB | 1.3% |
| 12 months, 60 expenses/month | 62 KB | 123 KB | 2.4% |
| 12 months, 120 expenses/month | 117 KB | 233 KB | 4.6% |
| 5 years, 60 expenses/month | 299 KB | 598 KB | 11.7% |

Two expenses a day for a year costs about a tenth of a megabyte, so the storage limit is not a real constraint. **Ajustes** shows the current size, and `Apagar o que tem mais de 12 meses` drops entries older than the twelve months ending on the current one: expenses, receipts, settled bills, bought items, and card purchases whose instalments have all been paid. The piggy bank balance survives that cut, folded into a single entry with no month attached.

---

## Files

```
index.html              the whole app — HTML, CSS and JS in one file, no dependencies
manifest.webmanifest    name, icons, standalone display mode
sw.js                   cache-first service worker, so the app opens offline
BACKUP.md               the backup file format, and an empty one to start from
icon-180.png            home screen shortcut (iOS)
icon-192/512.png        manifest icons
icon-512-maskable.png   adaptive icon (Android)
```

No build step, no `npm install`, no framework. Editing means opening `index.html`.

---

## Known limits

- One device only. Moving between phones is a manual backup and restore.
- Card instalments follow calendar months, not the statement closing date. A purchase is dated with the day it happened, anywhere from twelve months back to today, and a single choice says whether it lands on that month's bill or the next one, which is how you handle buying after the card closed.
- A card bill is settled as a whole. There is no partial payment, and paying it does not create an entry in any envelope — the bill is already committed money on its own.
- Saving the backup relies on the browser downloading a file. Inside an iOS home-screen app that sometimes opens the JSON in a viewer instead of saving it, and the text box behind `Ver a cópia como texto` is the way out.
- The projection starts from what this app knows, not from your bank: cash on hand is what has come in minus what has been logged out. It answers "does this month work out", not "what is my balance".
- Recurrence is implicit. Envelopes and the fixed income model repeat; expenses do not — you log them again every month.
- An expense logged straight into an envelope with due dates does not settle any of them. Use **marcar pago** on the parcel for that.
