"use client";

import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Control, Controller } from "react-hook-form";
import { SearchItemType } from "../../types/searches";

interface CustomQuizSearchListProps {
    searches: QueryDocumentSnapshot<SearchItemType, DocumentData>[];
    control: Control<{
        selectedItemsIds: string[];
    }>;
}

export const CustomQuizSearchList = ({ searches, control }: CustomQuizSearchListProps) => {
    return (
        <div className="flex flex-row gap-4">
            <fieldset className="w-full">
                <ul className="rounded-lg">
                    {searches.map(search => (
                        <li key={search.id} >
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
    )
}
