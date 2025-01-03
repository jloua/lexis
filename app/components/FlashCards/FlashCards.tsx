"use client";

import { useState } from "react";
import { FlashCardsType } from "../../types/forms";
import { Icon } from "../Icon";

export const FlashCards = ({ flashCards, onBackToPractice }: { flashCards: FlashCardsType, onBackToPractice: () => void }) => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false)

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    }

    return (
        <div>
            <p className="text-sm mt-4">Card {currentCardIndex + 1} / {flashCards.length}</p>
            <p className="text-sm mb-2">{flashCards[currentCardIndex].input_lang} {flashCards[currentCardIndex].output_lang ? "- " + flashCards[currentCardIndex].output_lang : "Simplification"}</p>

            <div className="mt-4 mb-8 group relative flex justify-center items-center text-darkBlue text-xs">
                <span className="absolute transition-all duration-300 ease-in-out group-hover:opacity-0">Help?</span>
                <span className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">Press card to flip it and see translation</span>
            </div>

            <div
                onClick={handleFlip}
                className={`card relative w-full h-80 cursor-pointer bg-darkBlue text-light rounded-lg ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
            >
                <div className="front">
                    <p className="absolute text-xs top-2 left-2">{flashCards[currentCardIndex].input_lang}</p>

                    <p>{flashCards[currentCardIndex].input}</p>
                </div>
                <div className="back">
                    <p className="absolute text-xs top-2 left-2">{flashCards[currentCardIndex].output_lang ?? flashCards[currentCardIndex].input_lang + " simplified"}</p>
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

            <div className="mt-4 group flex justify-center items-center text-darkBlue">
                <button className="text-btn transition-all duration-300 ease-in-out group-hover:pr-6" onClick={onBackToPractice}>Back to filters</button>
                <span className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"><Icon type="down-chevron" /></span>
            </div>
        </div>
    )
}
