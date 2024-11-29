"use client";

import { useState } from "react";
import { GeminiPostReqType } from "../types/gemini";
import { postGeminiRequest } from "../services/gemini";

const useGeminiAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const postGeminiRequestHandler = async (userInput: GeminiPostReqType) => {
    setLoading(true);
    setError(null);

    try {
      const res = await postGeminiRequest(userInput);
      setResult(res);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to process the request. Please try again.");
      }
    }
    setLoading(false);
  };

  return {
    error,
    loading,
    result,
    postGeminiRequest: postGeminiRequestHandler,
  };
};

export default useGeminiAPI;
