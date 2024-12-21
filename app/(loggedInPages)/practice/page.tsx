"use client";

import { FlashCards } from "@/app/components/FlashCards";
import { CustomQuizBuilder } from "@/app/components/forms/CustomQuizBuilder";
import { QuizFilter } from "@/app/components/forms/QuizFilter";
import { FlashCardsType } from "@/app/types/forms";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";

export default function Practice() {
    const [flashCards, setFlashCards] = useState<FlashCardsType | null>(null);

    const placeholderFlashCards: FlashCardsType = [
        {
            input: "Hej",
            output: "Hola",
            input_lang: "Swedish",
            output_lang: "Spanish",
            type: "translate",
            created_at: Timestamp.fromDate(new Date())
        },
        {
            input: "Hejsan",
            output: "Hello",
            input_lang: "Swedish",
            output_lang: "English",
            type: "translate",
            created_at: Timestamp.fromDate(new Date())
        },
        {
            input: "Hejsan",
            output: "Hello",
            input_lang: "Swedish",
            output_lang: "English",
            type: "translate",
            created_at: Timestamp.fromDate(new Date())
        }
    ]

    return (
        <main>
            <h2>Practice</h2>

            {/* <p className="mt-6 text-start">Practice 10 random phrases from your search history.</p>
            <p className="mt-4 text-start">Customize by using filters.</p>

            <QuizFilter onStartQuiz={setFlashCards} />

            <p className="mt-4 text-start">Or pick specific searches.</p>
            <CustomQuizBuilder onStartQuiz={setFlashCards} /> */}

            {/* Flash cards component */}
            {placeholderFlashCards && (
                <FlashCards flashCards={placeholderFlashCards} />
            )}
        </main>
    );
}
