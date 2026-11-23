# Crime Grid: coin economy

## Income (coins)
| Source | Amount |
|---|---|
| Solve a case (`COIN_BASE`) | Rookie 10, Detective 15, Inspector 20, Expert 30, Extreme 50 |
| Star bonus | 3 stars +10, 2 stars +5 |
| Daily case | everything above x2 |
| Win streak (no reveals) | +2 per win in a row, up to +20 |
| Daily gift (`BONUS`) | 10, 15, 20, 25, 30, 40, 60 over a 7-day streak |
| Daily missions | 15-25 each, +30 for all three |
| Star chest (15 stars) | 30-140 coins, or 30% chance of a free Common pack |
| Starting coins | 30 (was 100; existing saves keep their balance) |

Journey levels: 1-3 Rookie, 4-10 Detective, 11-25 Inspector with an Expert boss every 5th level, then Expert (Extreme bosses after level 50).
Hints cost `COST`: clue 20, check 10, reveal 50.

## Shop prices (v30, was 10-4000 with a gap between 40 and 300)
| Rarity | Pack | Price | Why |
|---|---|---|---|
| Common | Kitchen Crew | 90 | simplest art: hats and mustaches |
| Common | Circus Clowns | 100 | |
| Common | Wild West | 110 | |
| Common | Robo Squad | 120 | |
| Common | Pet Detectives | 120 | most characters (8 animals), cute, a favourite |
| Rare | Pirate Crew | 150 | |
| Rare | Shadow Ninjas | 180 | |
| Rare | Dino Hoodies | 210 | |
| Rare | Wizard Academy | 250 | |
| Rare | Noir Gangsters | 280 | the noir look matches the app |
| Epic | Super Squad | 400 | |
| Epic | Deep Sea Gang | 480 | 10 different sea animals |
| Epic | Monster Mash | 560 | 10 creatures (moved up from Rare) |
| Epic | Royal Court | 650 | gold frame |
| Epic | Space Crew | 800 | framed scene, aliens |
| Legendary | Neon Legends | 1500 | glowing, animated frame |
| Premium (real money) | Masquerade Ball $1.99, Cyber Agents $2.99 | unchanged | IAP ids unchanged |

Pack ids and IAP ids are unchanged, and `owned` is untouched, so nobody loses a pack they bought. The shop lists packs from cheapest to most expensive.

## Pacing (simulated with 30 starting coins)
The simulation includes the daily gift, one batch of missions per day and the streak bonus. Careful = no help, streak kept, 4 cases a day. Average = about one check per level, 3 cases a day. Casual = help on every level, 2 cases a day.

| Player | First pack (90) | 120 | 250 | 560 | 1500 (Neon) |
|---|---|---|---|---|---|
| Careful | level 3 | level 4 | level 6 | level 12 | level 25 |
| Average | level 4 | level 6 | level 11 | level 19 | level 45 |
| Casual | level 11 | level 13 | level 21 | level 37 | level 75 |

The first purchase lands at about level 4-6 for a typical player. The step between neighbouring tiers is at most about 1.5x inside Common/Rare/Epic; the only big jump is Epic to Legendary (800 to 1500), because Neon is the only Legendary pack.
The star chest only gives away Common packs (price up to 120).
