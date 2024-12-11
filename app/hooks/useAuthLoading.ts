"use client";

import { useContext } from "react";
import { AuthLoadingContext } from "../contexts/AuthLoadingContextProvider";

const useAuthLoading = () => {
  const authLoadingContext = useContext(AuthLoadingContext);

  if (!authLoadingContext) {
    throw new Error(
      "Trying to use AuthLoadingContext outside of AuthLoadingContextProvider"
    );
  }

  return authLoadingContext;
};

export default useAuthLoading;
