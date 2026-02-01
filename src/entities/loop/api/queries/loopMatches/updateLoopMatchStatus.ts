import { doc, updateDoc, type UpdateData } from "firebase/firestore";

import { db } from "src/shared/config/firebase/firebase";

import type { UpdateLoopMatchStatusInput } from "../../loopApi.types";
import { makeUpdateTsPatch } from "../../mappers/loopApi.mappers";

export async function updateLoopMatchStatusQuery(
  input: Pick<UpdateLoopMatchStatusInput, "matchId" | "status">
): Promise<void> {
  const { matchId, status } = input;

  const tsPatch = makeUpdateTsPatch();

  await updateDoc(
    doc(db, "loopMatches", matchId),
    {
      status,
      ...tsPatch,
    } as unknown as UpdateData<Record<string, unknown>>
  );
}
