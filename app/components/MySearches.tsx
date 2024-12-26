"use client";

import { useEffect, useState } from "react";
import { CollectionReference, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useGetAllSearches } from "../hooks/useGetAllSearches";
import { SearchItemType } from "../types/searches";
import { SearchList } from "./SearchList";
import { useDeleteDoc } from "../hooks/useDeleteDoc";
import { FirebaseError } from "firebase/app";

export const MySearches = ({ userId }: { userId: string }) => {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const { snapshot, error: snapshotError, loading: snapshotLoading } = useGetAllSearches(userId);
    const [docs, setDocs] = useState<QueryDocumentSnapshot<SearchItemType, DocumentData>[] | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { deleteDocument, error: deletionError, loading: deletionLoading } = useDeleteDoc()

    const seeAll = () => {
        setIsOpen(!isOpen)
    }

    const handleDeleteClick = async (docId: string, colRef: CollectionReference<DocumentData>) => {
        try {
            setLoading(true)
            setError(null);
            await deleteDocument(docId, colRef)
        } catch (error) {
            setError(error instanceof (Error || FirebaseError) ? error.message : "Error deleting document.")
        }
        setLoading(false)
    }

    useEffect(() => {
        if (snapshot) {
            setDocs(snapshot.docs);
            setLoading(false);
        }
    }, [snapshot])

    useEffect(() => {
        if (snapshotLoading || deletionLoading) {
            setLoading(true);
        }
    }, [snapshotLoading, deletionLoading])

    useEffect(() => {
        if (snapshotError || deletionError) {
            setError(
                snapshotError || deletionError || "An unknown error occurred."
            );
        }
    }, [snapshotError, deletionError])

    return (
        <div className="mt-12 flex flex-col gap-4 text-start">
            {error && <span className="error">{error}</span>}
            {loading ? (
                <span>Loading...</span>
            ) : docs && docs.length > 0 && (
                <>
                    <h3 >My searches</h3>
                    <div className="searchlist">
                        {isOpen || docs.length < 4 ? (
                            <SearchList docs={docs} onDeleteClick={handleDeleteClick} />
                        ) : (
                            <SearchList docs={docs.slice(0, 3)} onDeleteClick={handleDeleteClick} />
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
