"use client";

import { useEffect, useState } from "react";
import { getLanguageList } from "../services/languages";
import { LanguageResult } from "../types/languages";

export const useGetLanguageList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LanguageResult | null>(null);

  const getLanguageListHandler = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getLanguageList();

      setResult(res);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      setError("Failed fetching languages");
    }
    setLoading(false);
  };

  useEffect(() => {
    getLanguageListHandler();
  }, []);

  return { loading, error, result };
};
