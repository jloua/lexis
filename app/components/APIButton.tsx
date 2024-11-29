'use client';

import useGeminiAPI from "../hooks/useGeminiAPI";


const APIButton = () => {
    const userInput = { type: "translate" as const, input_language: "zh", output_language: "sv", input: "您还可以使用变体修饰符来定位媒体查询，例如响应式断点、暗模式、偏好减少运动等" };
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
