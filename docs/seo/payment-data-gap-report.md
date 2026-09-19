# Payment Data Gap Report

**Date:** 2026-09-19
**Status:** 15 verified casinos have zero payment-method relationships in `casino.db`

## Summary

15 of 138 verified casinos (10.9%) have no payment method associations in the database. All 15 are Germany-only (GGL-licensed) casinos. This is a data gap — no payment data was fabricated.

## Affected Casinos

| # | Casino | Slug | GEOs | Licenses | Owner | Feasibility |
|---|--------|------|------|----------|-------|-------------|
| 1 | Löwen Play | loewen-play | DE | GGL | Löwen Play digital GmbH | Medium — GGL casinos may have limited public payment info |
| 2 | Wildz | wildz | DE | GGL | Rootz Limited | Medium — Rootz operates multiple brands |
| 3 | Jokerstar | jokerstar | DE | GGL | Jokerstar GmbH | Low — small operator |
| 4 | bet-at-home | bet-at-home | DE | GGL | Bet-at-home.com Internet Limited | High — established operator, likely has payment data on website |
| 5 | DAZN Bet | dazn-bet | DE | GGL | DZBT Operations Limited | Medium — sports betting focused |
| 6 | Admiralbet | admiralbet | DE | GGL | Greentube Betting Malta Limited | Medium — Novomatic subsidiary |
| 7 | Interwetten | interwetten | DE | GGL | Interwetten Gaming Limited | High — established operator |
| 8 | LeoVegas | leovegas | DE | GGL | LVSports Limited | High — major brand, likely has payment data |
| 9 | PokerStars | pokerstars | DE | GGL | Reel Germany Limited (Flutter) | High — major brand |
| 10 | Ladbrokes | ladbrokes | DE | GGL | Ladbrokes (Deutschland) Limited (Entain) | High — major brand |
| 11 | bet365 | bet365 | DE | GGL | Hillside (Europe) ENC | High — major brand |
| 12 | VBET | vbet | DE | GGL | SCGO Limited | Medium |
| 13 | Sportingbet | sportingbet | DE | GGL | Sportingbet (Deutschland) Limited (Entain) | High — Entain subsidiary |
| 14 | Tipwin | tipwin | DE | GGL | Tipwin Limited | Low — small operator |
| 15 | TipTorro | tiptorro | DE | GGL | Torro Tec Gaming Limited | Low — small operator |

## Analysis

### Why These Casinos Have No Payment Data

All 15 casinos are Germany-only with GGL licenses. Possible reasons:
1. **GGL regulatory constraints** — Germany's gambling regulator may restrict how payment information is displayed
2. **Import scope** — These casinos were imported with basic data but payment method relationships were not established
3. **Data source limitation** — The original data collection may not have captured payment methods for these operators

### Recommendation

**Do NOT fabricate payment data.** Payment enrichment should only occur when:
1. A trusted, verifiable source is identified (operator website, regulatory filing)
2. The data can be cross-referenced with at least one other source
3. The enrichment follows the existing fact-provenance system

### Priority for Enrichment

**High priority** (established operators, likely have public payment info):
- bet365, LeoVegas, PokerStars, Ladbrokes, Interwetten, bet-at-home, Sportingbet

**Medium priority** (known operators, may have limited public info):
- Löwen Play, Wildz, DAZN Bet, Admiralbet, VBET

**Low priority** (small operators, may have limited public info):
- Jokerstar, Tipwin, TipTorro

## Impact on Current System

- These 15 casinos are still fully functional in the system (reviews, ratings, licenses, GEO availability)
- They appear in casino listings and search results
- Their profiles show "No payment methods listed" rather than fabricated data
- They do NOT affect payment entity SEO pages (which only include verified payment data)
