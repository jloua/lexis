"use client";

import { FlashCards } from "@/app/components/FlashCards/FlashCards";
import { CustomQuizBuilder } from "@/app/components/FlashCards/CustomQuizBuilder";
import useAuth from "@/app/hooks/useAuth";
import { useGetAllSearches } from "@/app/hooks/useGetAllSearches";
import { FlashCardsType } from "@/app/types/forms";
import { SearchItemType } from "@/app/types/searches";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

export default function Practice() {
    const [flashCards, setFlashCards] = useState<FlashCardsType | null>(null);
    const { currentUser } = useAuth();
    const [userId, setUserId] = useState<string>("");
    const { snapshot, loading } = useGetAllSearches(userId);

    const searches: QueryDocumentSnapshot<SearchItemType, DocumentData>[] = useMemo(() => (snapshot ? snapshot.docs : []), [snapshot]);

    const handleStart = () => {
        if (searches) {
            const shuffled = searches.map(item => item.data()).sort(() => Math.random() - 0.5);
            const randomCards = shuffled.slice(0, Math.min(shuffled.length, 10));
            setFlashCards(randomCards)
        }
    }

    useEffect(() => {
        if (currentUser && currentUser.uid) {
            setUserId(currentUser.uid);
        }
    }, [currentUser])

    return (
        <main>
            <h2>Practice</h2>

            {!flashCards && (
                <>
                    <p className="mt-6 text-start">Practice 10 random phrases from your search history.</p>

                    <p className="mt-4 text-start">Or customize your own.</p>
                    {searches && <CustomQuizBuilder searches={searches} onStartQuiz={setFlashCards} />}

                    <button className="btn-primary mx-auto mt-6" onClick={handleStart}>Start</button>
                </>
            )}

            {flashCards && !loading && (
                <FlashCards flashCards={flashCards} />
            )}
        </main>
    );
}
