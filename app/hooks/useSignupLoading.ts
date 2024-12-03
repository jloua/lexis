"use client";

import { useContext } from "react";
import { SignupLoadingContext } from "../contexts/SignupLoadingContextProvider";

const useSignupLoading = () => {
  const signupLoadingContext = useContext(SignupLoadingContext);

  if (!signupLoadingContext) {
    throw new Error(
      "Trying to use SignupLoadingContext outside of SignupLoadingContextProvider"
    );
  }

  return signupLoadingContext;
};

export default useSignupLoading;
