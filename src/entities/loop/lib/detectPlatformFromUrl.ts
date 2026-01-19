import type { LoopPlatform } from "src/entities/loop/model";

function tryParseUrl(input: string): URL | null {
  const v = input.trim();
  if (!v) return null;

  try {
    return new URL(v);
  } catch {
    // allow pasting without protocol
    try {
      return new URL(`https://${v}`);
    } catch {
      return null;
    }
  }
}


export function detectPlatformFromUrl(input: string): LoopPlatform | null {
  const u = tryParseUrl(input);
  if (!u) return null;

  const host = u.hostname.toLowerCase();

  // Job boards
  if (host.includes("linkedin.")) return "linkedin";
  if (host.includes("indeed.")) return "indeed";
  if (host.includes("stepstone.")) return "stepstone";
  if (host.includes("xing.")) return "xing";
  if (host.includes("monster.")) return "monster";
  if (host.includes("jobware.")) return "jobware";
  if (host.includes("kimeta.")) return "kimeta";
  if (host.includes("jooble.")) return "jooble";
  if (host.includes("adzuna.")) return "adzuna";
  if (host.includes("glassdoor.")) return "glassdoor";

  // Tech
  if (host.includes("honeypot.")) return "honeypot";
  if (host.includes("germantechjobs.")) return "germantechjobs";
  if (host.includes("instaffo.")) return "instaffo";
  if (host.includes("wellfound.")) return "wellfound";
  if (host.includes("get-in-it.")) return "getinit";
  if (host.includes("wearedevelopers.")) return "wearedevelopers";
  if (host.includes("devjobs.")) return "devjobs";

  // Remote
  if (host.includes("arbeitnow.")) return "arbeitnow";
  if (host.includes("remoteok.")) return "remoteok";
  if (host.includes("weworkremotely.")) return "weworkremotely";
  if (host.includes("remotive.")) return "remotive";
  if (host.includes("remoteok.com")) return "remoteok";

  // DE-specific
  if (host.includes("arbeitsagentur.")) return "arbeitsagentur";
  if (host.includes("meinestadt.")) return "meinestadt";
  if (host.includes("stellenanzeigen.")) return "stellenanzeigen";
  if (host.includes("jobvector.")) return "jobvector";
  if (host.includes("joblift.")) return "joblift";
  if (host.includes("gigajob.")) return "gigajob";

  // Ausbildung
  if (host.includes("azubi.de")) return "azubide";
  if (host.includes("ausbildung.de")) return "ausbildungde";
  if (host.includes("azubiyo.")) return "azubiyo";
  if (host.includes("praktikum.info")) return "praktikuminfo";
  if (host.includes("ihk-lehrstellenboerse") || host.includes("lehrstellenboerse")) return "ihk";

  return null;
}
