import type { LoopMatchStatus, RemoteMode, LoopPlatform, CanonicalFilters } from "src/entities/loop/model";


export type CreateLoopInput = {
  userId: string;
  name: string;
  titles: string[];
  location: string;
  radiusKm: number;
  remoteMode: RemoteMode;
  platforms: LoopPlatform[];
  filters?: CanonicalFilters;
};

export type UpdateLoopInput = {
  loopId: string;

  name?: string;
  titles?: string[];
  location?: string;
  radiusKm?: number;
  remoteMode?: RemoteMode;
  platforms?: LoopPlatform[];

  filters?: CanonicalFilters;
};

export type CreateMatchInput = {
  userId: string;
  loopId: string;

  title: string;
  company: string;
  location: string;

  platform: LoopPlatform;
  url: string;
  description: string;

  status: LoopMatchStatus;
  matchedAt: string;
};

export type UpdateLoopMatchStatusInput = {
  userId: string; 
  matchId: string;
  loopId: string;
  status: LoopMatchStatus;
};

export type DeleteLoopMatchInput = {
  matchId: string;
  loopId: string;
};
