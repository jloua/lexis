"use client";

import { useEffect, useState } from "react";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useGetAllSearches } from "../hooks/useGetAllSearches";
import { SearchItemType } from "../types/searches";
import { SearchList } from "./SearchList";

export const MySearches = ({ userId }: { userId: string }) => {
    const { snapshot, error, loading } = useGetAllSearches(userId);
    const [docs, setDocs] = useState<QueryDocumentSnapshot<SearchItemType, DocumentData>[] | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const seeAll = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        if (snapshot) {
            setDocs(snapshot.docs)
        }
    }, [snapshot])

    return (
        <div className="mt-12 flex flex-col gap-4 text-start">
            {error && <span className="error">{error}</span>}
            {loading && <span>Loading...</span>}

            {docs && (
                <>
                    <h3 >My searches</h3>
                    <div className={isOpen ? "h-fit border border-dark rounded-lg drop-shadow" : "h-72 overflow-hidden relative border border-dark rounded-t-lg"}>
                        <div className={isOpen ? "hidden" : "absolute w-full h-72 bg-gradient-to-t from-dark to-transparent to-30% opacity-40"}></div>
                        <SearchList docs={docs} />
                    </div>
                    {docs.length > 3 && (
                        <button className="btn-primary ml-auto" onClick={seeAll}>{isOpen ? "Show less" : "See all"}</button>
                    )}
                </>
            )}
        </div>
    )
}
