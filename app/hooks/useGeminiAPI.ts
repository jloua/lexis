"use client";

import axios from "axios";
import { useState } from "react";
import { GeminiPostReqType, GeminiResponse } from "../types/gemini";

const useGeminiAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const postGeminiRequest = async (userInput: GeminiPostReqType) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post<GeminiResponse>("../api/gemini", userInput);
      setResult(res.data.message.content);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to process the request. Please try again.");
      }
    }
    setLoading(false);
  };

  return { error, loading, result, postGeminiRequest };
};

export default useGeminiAPI;
