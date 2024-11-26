'use client';

import axios from "axios";
import { useState } from "react";

// const getAIResponse = async () => {
//     const res = await axios.get('../api/gemini');
//     console.log(res.data.message);
// }

const postTranlationReq = async (userInput: { type: string, input_language: string, output_language?: string, input: string }) => {
    const res = await axios.post('../api/gemini', userInput);
    console.log(res.data.message);
    return res.data.message.kwargs.content;
}

const APIButton = () => {
    const [output, setOutput] = useState("");
    const userInput = { type: "translation", input_language: "en", output_language: "sv", input: "You can also use variant modifiers to target media queries like responsive breakpoints, dark mode, prefers-reduced-motion, and more." };
    const userInputSimplify = { type: "simplify", input_language: "en", input: "You can also use variant modifiers to target media queries like responsive breakpoints, dark mode, prefers-reduced-motion, and more." };

    const handleClick = async (type: string) => {
        if (type === "translate") {
            const translation = await postTranlationReq(userInput);
            setOutput(translation);
        }

        if (type === "simplify") {
            const output = await postTranlationReq(userInputSimplify);
            setOutput(output);
        }
    };



    return (
        <div>
            <button onClick={() => handleClick("translate")}>Translate</button>
            <button onClick={() => handleClick("simplify")}>Simplify</button>
            {output && (
                <p>{output}</p>
            )}
        </div>
    )
}

export default APIButton
