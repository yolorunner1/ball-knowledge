# Ball Knowledge

Global football statistics — live scores, fixtures, standings, player stats, news.

**Live:** [ballknowledge.online](https://ballknowledge.online)

## Stack

- Frontend: vanilla HTML/CSS/JS (single `index.html`)
- Backend: Vercel serverless functions (`/api`)
- Football data: [API-Football v3](https://www.api-football.com/)
- News: [GNews](https://gnews.io/)
- Hosting: Vercel (Hobby / free)
- Domain/DNS: Fasthosts

## Environment Variables

Set these in **Vercel → Settings → Environment Variables**:

| Key                | Value                                   |
| ------------------ | --------------------------------------- |
| `API_FOOTBALL_KEY` | Your API-Football key                   |
| `NEWS_API_KEY`     | Your GNews key (from gnews.io)          |

Optional (only if you wire up real email later — see `api/subscribe.js`):

| Key                    | Purpose                           |
| ---------------------- | --------------------------------- |
| `MAILCHIMP_API_KEY`    | Mailchimp integration             |
| `MAILCHIMP_LIST_ID`    | Mailchimp list                    |
| `RESEND_API_KEY`       | Resend integration                |
| `RESEND_AUDIENCE_ID`   | Resend audience                   |

## File Structure

```
ball-knowledge/
├── index.html              Entire frontend (all pages, styles, JS, modals)
├── vercel.json             Minimal Vercel config
├── BK.png                  Logo / favicon (add this yourself)
├── .gitignore
├── README.md
└── api/
    ├── fixtures.js         Proxy → API-Football fixtures
    ├── standings.js        Proxy → API-Football standings
    ├── scorers.js          Proxy → top scorers / top assists
    ├── leagues.js          Proxy → league search
    ├── players.js          Proxy → player search / player by id
    ├── teams.js            Proxy → team info + venue + season stats
    ├── fixture-details.js  Proxy → events + lineups + stats (match modal)
    ├── news.js             Proxy → GNews football news
    └── subscribe.js        Email subscription stub (wire to your ESP)
```

## Features

### Home
- Top competitions only (18 leagues from handover priority list)
- Live badge: **X LIVE · Y countries**
- Date switcher (Yesterday / Today / Tomorrow)
- 🔥 Hot News section below fixtures

### Fixtures
- All leagues and cups worldwide
- Top competitions always first, then alphabetical
- Date range -2 to +3 days
- Search by name, country or abbreviation (EPL, UCL, BL, Serie A...)

### Standings
- Quick tabs for top 8 leagues
- Autocomplete dropdown — type to search any competition worldwide
- **Click any team → team detail modal** (venue, capacity, season stats)

### Stats
- Player search (min 3 chars) — click any result for full profile
- Top Scorers section (top 8 leagues, dropdown selector)
- Top Assists section (top 8 leagues, dropdown selector)
- **Click any player → full stat breakdown** (goals, assists, passes, shots, duels, cards, rating, position, bio)

### News
- 8 filter tabs (All Football, PL, UCL, Transfers, Injuries, La Liga, Bundesliga, Serie A)
- Fetches from GNews (free tier: 100 req/day)

### Match Details
- **Click any fixture → match modal** with events (goals, cards, subs), live stats bars, and lineups
- Updates as the match progresses

### Notifications
- Bell icon in nav
- Toggle: Browser alerts for goals (uses Notification API, polls live fixtures every 2 min)
- Toggle: Email digest (stubs to `/api/subscribe` — wire to Mailchimp/Resend/ConvertKit)

## Deploy

1. Push to GitHub.
2. In Vercel, set **Root Directory** to `ball-knowledge` (Build & Deployment settings).
3. Add env vars above.
4. Vercel auto-deploys on every commit to `main`.

## DNS (Fasthosts)

| Type  | Name | Value                  |
| ----- | ---- | ---------------------- |
| A     | @    | `76.76.21.21`          |
| CNAME | www  | `cname.vercel-dns.com` |

## Making Changes (no VS Code needed)

1. Go to the file on GitHub
2. Click the pencil icon (Edit)
3. Paste new code
4. Commit → Vercel auto-deploys in ~60s

## Notes

- Season is hardcoded to **2025** in `index.html` (`const SEASON`). Change this once the new season starts.
- `World` league country is relabelled to `UEFA & International` everywhere.
- API-Football free tier is ~100 requests/day — caching is set on all endpoints to minimise burn.
- Live goal polling only runs when the user has enabled browser notifications AND the tab is visible.
