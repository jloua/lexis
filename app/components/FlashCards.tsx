"use client";

import { useState } from "react";
import { FlashCardsType } from "../types/forms";
import { Icon } from "./Icon";

export const FlashCards = ({ flashCards }: { flashCards: FlashCardsType }) => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false)

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    }

    return (
        <div>
            <p className="text-sm mt-4">Card {currentCardIndex + 1} / {flashCards.length}</p>
            <p className="text-sm mb-2">{flashCards[currentCardIndex].input_lang} - {flashCards[currentCardIndex].output_lang}</p>

            <div
                onClick={handleFlip}
                className={`card relative w-full h-80 cursor-pointer bg-darkBlue text-light rounded-lg ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
            >
                <div className="front">
                    <p className="absolute text-xs top-2 left-2">{flashCards[currentCardIndex].input_lang}</p>

                    <p>{flashCards[currentCardIndex].input}</p>
                </div>
                <div className="back">
                    <p className="absolute text-xs top-2 left-2">{flashCards[currentCardIndex].output_lang}</p>
                    <p>{flashCards[currentCardIndex].output}</p>
                </div>
            </div>

            <div className="mt-4 flex">
                {currentCardIndex > 0 && <button className="btn-secondary w-2/5 mr-auto flex justify-between items-center" onClick={() => { setCurrentCardIndex(prev => prev - 1) }}>
                    <span className="rotate-90"><Icon type="down-chevron" /></span>
                    <span>Previous</span>
                </button>}

                {currentCardIndex + 1 < flashCards.length && <button className="btn-secondary w-2/5 ml-auto flex justify-between items-center" onClick={() => setCurrentCardIndex(prev => prev + 1)}>
                    <span>Next</span>
                    <span className="-rotate-90"><Icon type="down-chevron" /></span>
                </button>}
            </div>
        </div>
    )
}
