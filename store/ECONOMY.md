# Crime Grid: coin economy (v2, slower on purpose)

Goal: a mid-tier skin takes about 2 to 3 weeks of normal play, so coins have a reason to be bought.

## Income (coins)
| Source | Amount |
|---|---|
| Solve a case (`COIN_BASE`) | Rookie 5, Detective 8, Inspector 10, Expert 15, Extreme 25 |
| Star bonus | 3 stars +5, 2 stars +2 |
| Daily case | everything above x2 |
| Daily gift (`BONUS`) | 10, 15, 20, 25, 30, 40, 60 over a 7-day streak |
| Daily mission | one per day, 15 to 25 coins |
| Trophies | 50 once each (12 trophies) |
| Starting coins | 30 |

Removed in this version: win-streak bonus, star chest, "all missions" bonus. A streak freeze (earned at every 7th streak day, max 2) keeps a daily streak alive after one missed day.
Typical income: about 70 to 120 coins a day for a player who solves 3 to 5 cases and the daily case.
Hints cost `COST`: clue 20, check 10, reveal 50.

## Shop prices (coins, 4x the old ladder)
| Rarity | Packs | Price |
|---|---|---|
| Common | Kitchen Crew 360, Circus Clowns 400, Wild West 440, Robo Squad 480, Pet Detectives 480 | 3 to 7 days |
| Rare | Pirate Crew 600, Shadow Ninjas 720, Dino Hoodies 840, Wizard Academy 1,000, Noir Gangsters 1,120 | 1 to 2 weeks |
| Epic | Super Squad 1,600, Deep Sea Gang 1,920, Monster Mash 2,240, Royal Court 2,600, Space Crew 3,200 | 3 to 6 weeks |
| Legendary | Neon Legends 6,000 | 2 months |

Real-money coin packs (Google Play): 500 for $0.99, 1,200 for $1.99, 3,000 for $3.99, 7,500 for $7.99.
Premium packs (real money only, never for coins): Masquerade Ball $1.99, Cyber Agents $2.99, Jazz Age $2.99, Steampunk Guild $2.99, Haunted Gala $1.99.
Exclusive (earned only by duelling a new friend): Partners in Crime.

Pack ids, IAP ids and the `owned` list are unchanged, so nobody loses a pack they already own. Players who had saved coins keep them, but the same coins now buy less.
Duel stakes (25 to 500) come out of the same coins and are trust-based (coins are local).
