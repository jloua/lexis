"use client";

import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { SearchItemType } from '@/app/types/searches';
import { Icon } from '../Icon';
import { CustomQuizType, FlashCardsType } from '@/app/types/forms';
import { CustomQuizModal } from './CustomQuizModal';

export const CustomQuizBuilder = ({ searches, onStartQuiz }: { searches: QueryDocumentSnapshot<SearchItemType, DocumentData>[], onStartQuiz: (flashcards: FlashCardsType) => void }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <div className="bg-light text-dark border border-dark rounded-lg drop-shadow px-4 py-2 relative text-start mt-4 hover:cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <span>CUSTOMIZE</span>
                <span className="absolute right-3 top-4">
                    <Icon type="down-chevron" />
                </span>
            </div>

            {isOpen && (
                <CustomQuizModal
                    searches={searches}
                    onStartQuiz={onStartQuiz}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}
