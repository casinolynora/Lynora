import type { Casino } from "@/lib/types/casino";
import { starGames } from "./stargames";
import { loewenPlay } from "./loewen-play";
import { lapalingo } from "./lapalingo";
import { wildz } from "./wildz";
import { jackpotPiraten } from "./jackpotpiraten";
import { bingBong } from "./bingbong";
import { jokerstar } from "./jokerstar";
import { wunderino } from "./wunderino";
import { slotMagie } from "./slotmagie";

export const germanyVerifiedCasinos: Casino[] = [
  starGames,
  loewenPlay,
  lapalingo,
  wildz,
  jackpotPiraten,
  bingBong,
  jokerstar,
  wunderino,
  slotMagie,
];
