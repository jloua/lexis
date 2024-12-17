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
                    <div className="searchlist">
                        {isOpen || docs.length < 4 ? (
                            <SearchList docs={docs} />
                        ) : (
                            <SearchList docs={docs.slice(0, 3)} />
                        )}
                    </div>
                    {docs.length > 3 && (
                        <button className="btn-primary ml-auto" onClick={seeAll}>{isOpen ? "Show less" : "See all"}</button>
                    )}
                </>
            )}
        </div>
    )
}
