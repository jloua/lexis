'use client';

import useGeminiAPI from "../hooks/useGeminiAPI";


const APIButton = () => {
    const userInput = { type: "translation" as const, input_language: "en", output_language: "sv", input: "You can also use variant modifiers to target media queries like responsive breakpoints, dark mode, prefers-reduced-motion, and more." };
    const userInputSimplify = { type: "simplify" as const, input_language: "sv", input: "Tankekonflikt" };
    const { loading, result, error, postGeminiRequest } = useGeminiAPI();

    const handleClick = async (type: string) => {
        const reqInput = type === "translate" ? userInput : userInputSimplify;

        postGeminiRequest(reqInput);
    };

    return (
        <div>
            <button onClick={() => handleClick("translate")} disabled={loading}>Translate</button>
            <button onClick={() => handleClick("simplify")} disabled={loading}>Simplify</button>
            {error && (
                <p>{error}</p>
            )}
            {result && (
                <p>{result}</p>
            )}
        </div>
    )
}

export default APIButton
