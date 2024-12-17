import { DocumentData, QuerySnapshot, Timestamp } from "firebase/firestore";

export type SearchItemType = {
  type: "simplify" | "translate";
  input_lang: string;
  output_lang: string | null;
  input: string;
  output: string;
  created_at: Timestamp;
};

export type GetSearchItemsResult = {
  error: string | null;
  loading: boolean;
  snapshot: QuerySnapshot<SearchItemType, DocumentData> | undefined;
};
