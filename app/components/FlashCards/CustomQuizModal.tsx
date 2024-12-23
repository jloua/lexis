"use client";
import { useCallback, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { SearchItemType } from "../../types/searches";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { CustomQuizSearchList } from "./CustomQuizSearchList";
import { CustomQuizFilter } from "./CustomQuizFilter";
import { CustomQuizType, FlashCardsType } from "../../types/forms";


export const CustomQuizModal = ({ searches, onClose, onStartQuiz }: { searches: QueryDocumentSnapshot<SearchItemType, DocumentData>[], onClose: () => void, onStartQuiz: (flashcards: FlashCardsType) => void }) => {
    const [filteredSearches, setFilteredSearches] = useState(searches);
    const [itemCount, setItemCount] = useState(Math.min(searches.length, 10));
    const { handleSubmit, control, watch, formState: { isSubmitting } } = useForm<CustomQuizType>({
        defaultValues: { selectedItemsIds: [] }
    });
    const selectedItems = watch("selectedItemsIds");

    const onSubmit: SubmitHandler<CustomQuizType> = (data) => {
        onClose()

        if (!searches) {
            return;
        }

        if (selectedItems.length) {
            const filteredSnapshot = searches.filter(item => data.selectedItemsIds.includes(item.id));
            const searchItems = filteredSnapshot.map(item => item.data());

            onStartQuiz(searchItems);
        } else {
            const filteredItems = filteredSearches
                .map(item => item.data())
                .slice(0, filteredSearches.length > 10 ? 10 : filteredSearches.length)
                .slice(0, itemCount);

            onStartQuiz(filteredItems);
        }
    }

    const handleFilterChange = useCallback((newFilteredSearches: QueryDocumentSnapshot<SearchItemType, DocumentData>[]) => {
        setFilteredSearches(newFilteredSearches);
    }, []);

    const handleItemCountChange = (newCount: number) => {
        setItemCount(newCount);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-offWhite p-6 rounded-lg shadow-lg w-11/12 max-w-md h-[90%]">
                <button
                    className="absolute top-[2.75rem] right-[1.75rem] w-8 h-8 bg-light border border-dark rounded-full"
                    onClick={() => onClose()}
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 h-full">
                    <h4 className="mb-2">Choose searches</h4>

                    <div className="h-[75%] overflow-scroll">
                        <CustomQuizFilter onFilterChange={handleFilterChange} searches={searches} itemCount={itemCount} setItemCount={handleItemCountChange} />
                        <CustomQuizSearchList searches={filteredSearches} control={control} />
                    </div>

                    <p className="text-end mt-2">{selectedItems.length === 0 ? "No" : selectedItems.length} selected item{(selectedItems.length > 1 || selectedItems.length === 0) && "s"}</p>
                    <button type="submit" className="btn-primary absolute bottom-12 right-8" disabled={isSubmitting}>{selectedItems.length > 0 ? "Start quiz" : "Generate quiz"}</button>
                </form>
            </div>
        </div>
    )
}
