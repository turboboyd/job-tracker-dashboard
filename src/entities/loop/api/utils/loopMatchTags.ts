import type { LoopMatch } from "src/entities/loop/model";

export function provideLoopMatchListTags(
  res: LoopMatch[] | undefined,
  loopId: string
) {
  return res
    ? [
        ...res.map((m) => ({ type: "LoopMatches" as const, id: m.id })),
        { type: "LoopMatches" as const, id: `LIST:${loopId}` },
      ]
    : [{ type: "LoopMatches" as const, id: `LIST:${loopId}` }];
}
