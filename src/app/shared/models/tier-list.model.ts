import { TierListEntry } from './tier-list-entry.mode';

export interface TierList {
  title: string;
  entries: TierListEntry[];
}

export interface TierListResponse extends TierList {
  id: string;
  imageUrl: string;
}

export interface TierListRequest extends TierList {
  userId: string;
  imageId?: string;
}
