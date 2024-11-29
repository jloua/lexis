import axios from "axios";
import { LanguageResult } from "../types/languages";

export const getLanguageList = async () => {
  try {
    const res = await axios.get<LanguageResult>(
      "https://libretranslate.com/languages"
    );

    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch languages");
  }
};
