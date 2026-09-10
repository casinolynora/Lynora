import type { Casino } from "@/lib/types/casino";
import { hollandCasino } from "./holland-casino";
import { toto } from "./toto";
import { kansino } from "./kansino";
import { bet365Nl } from "./bet365-nl";
import { unibetNl } from "./unibet-nl";
import { circusNl } from "./circus-nl";
import { leoVegasNl } from "./leovegas-nl";
import { the888Nl } from "./888-nl";
import { betMgmNl } from "./betmgm-nl";
import { vbetNl } from "./vbet-nl";
import { tonyBetNl } from "./tonybet-nl";
import { hardRockCasinoNl } from "./hardrockcasino-nl";
import { starCasinoNl } from "./starcasino-nl";
import { comeOnNl } from "./comeon-nl";

export const netherlandsVerifiedCasinos: Casino[] = [
  hollandCasino,
  toto,
  kansino,
  bet365Nl,
  unibetNl,
  circusNl,
  leoVegasNl,
  the888Nl,
  betMgmNl,
  vbetNl,
  tonyBetNl,
  hardRockCasinoNl,
  starCasinoNl,
  comeOnNl,
];
