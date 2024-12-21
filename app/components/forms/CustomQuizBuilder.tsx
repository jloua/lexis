"use client";

import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import useAuth from '@/app/hooks/useAuth';
import { useGetAllSearches } from '@/app/hooks/useGetAllSearches';
import { SearchItemType } from '@/app/types/searches';
import { Icon } from '../Icon';
import { CustomQuizType, FlashCardsType } from '@/app/types/forms';

export const CustomQuizBuilder = ({ onStartQuiz }: { onStartQuiz: (flashcards: FlashCardsType) => void }) => {
    const { currentUser } = useAuth();
    const [userId, setUserId] = useState<string>("");
    const { snapshot } = useGetAllSearches(userId);
    const [searches, setSearches] = useState<QueryDocumentSnapshot<SearchItemType, DocumentData>[] | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { handleSubmit, control, watch, } = useForm<CustomQuizType>({
        defaultValues: { selectedItemsIds: [] }
    });
    const selectedItems = watch("selectedItemsIds");

    const onSubmit: SubmitHandler<CustomQuizType> = (data) => {
        console.log(data, onStartQuiz)
        setIsOpen(false)
        // filter out the matching searches based on id:s 
        // send to onStartQuiz with number as selectedItems.length
    }

    useEffect(() => {
        if (currentUser && currentUser.uid) {
            setUserId(currentUser.uid);
        }
    }, [currentUser])

    useEffect(() => {
        if (snapshot) {
            setSearches(snapshot.docs);
        }
    }, [snapshot])

    return (
        <div>
            <div className="bg-light text-dark border border-dark rounded-lg drop-shadow px-4 py-2 relative text-start mt-4 hover:cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <span>CHOOSE</span>
                <span className="absolute right-3 top-4">
                    <Icon type="down-chevron" />
                </span>
            </div>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-offWhite p-6 rounded-lg shadow-lg w-11/12 max-w-md h-[90%]">
                        <button
                            className="absolute top-[2.75rem] right-[1.75rem] w-8 h-8 bg-light border border-dark rounded-full"
                            onClick={() => setIsOpen(false)}
                        >
                            &times;
                        </button>
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 h-full">
                            <h4 className="mb-2">Choose searches</h4>

                            {searches && (
                                <div className="flex flex-row gap-4 h-[75%] overflow-scroll">
                                    <fieldset>
                                        <ul className="rounded-lg">
                                            {searches.map(search => (
                                                <li key={search.id}>
                                                    <label htmlFor={search.id} className="w-full cursor-pointer" >
                                                        <div className="flex flex-row items-center gap-4">
                                                            <Controller control={control} name="selectedItemsIds" render={({ field }) => (
                                                                <input
                                                                    {...field}
                                                                    checked={field.value.includes(search.id)}
                                                                    className="accent-darkBlue"
                                                                    id={search.id}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        const isChecked = e.target.checked;
                                                                        field.onChange(
                                                                            isChecked
                                                                                ? [...field.value, value]
                                                                                : field.value.filter((id: string) => id !== value)
                                                                        )
                                                                    }}
                                                                    type="checkbox"
                                                                    value={search.id}
                                                                />
                                                            )} />

                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-[10px]">{search.data().input_lang} {search.data().output_lang && `- ${search.data().output_lang}`}</span>
                                                                <p className="font-[helvetica]">{search.data().input}</p>
                                                                <p className="font-bold font-[helvetica]">{search.data().output}</p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </fieldset>
                                </div>
                            )}
                            <p className="text-end mt-2">{selectedItems.length === 0 ? "No" : selectedItems.length} selected item{(selectedItems.length > 1 || selectedItems.length === 0) && "s"}</p>
                            <button type="submit" className="btn-primary absolute bottom-12 right-8">Start quiz</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
