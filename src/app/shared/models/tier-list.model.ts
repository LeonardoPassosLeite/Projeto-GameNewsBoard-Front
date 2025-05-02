import { TierListEntry } from './tier-list-entry.model';

export interface TierList {
  title: string;
  imageUrl?: string;
}

export interface TierListResponse extends TierList {
  id: string;
  entries: TierListEntry[];
}

export interface TierListRequest extends TierList {
  imageId?: string;
}
