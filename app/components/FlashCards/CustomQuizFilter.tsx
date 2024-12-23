"use client";

import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { SearchItemType } from "../../types/searches";
import { Icon } from "../Icon";

interface CustomQuizFilterProps {
    searches: QueryDocumentSnapshot<SearchItemType, DocumentData>[];
    onFilterChange: (filteredSearches: QueryDocumentSnapshot<SearchItemType, DocumentData>[]) => void;
    itemCount: number;
    setItemCount: (newCount: number) => void
}

export const CustomQuizFilter = ({ searches, onFilterChange, itemCount, setItemCount }: CustomQuizFilterProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredItems, setFilteredItems] = useState<QueryDocumentSnapshot<SearchItemType, DocumentData>[]>(searches);
    const [type, setType] = useState<"translate" | "simplify" | "any">("any");
    const [inputLang, setInputLang] = useState("Any language");
    const [outputLang, setOutputLang] = useState("Any language");

    const inputLangOptions = [...new Set(searches.map(search => search.data().input_lang))]
    const outputLangOptions = type === "translate" && inputLang
        ? [...new Set(searches
            .filter(item => item.data().input_lang === inputLang)
            .map(item => item.data().output_lang)
            .filter(item => typeof item === "string")
        )]
        : null
    inputLangOptions.push("Any language");
    if (outputLangOptions) {
        outputLangOptions.push("Any language")
    }

    useEffect(() => {
        const filterItems = () => {
            let filtered = [...searches];

            if (type !== "any") {
                filtered = filtered.filter((item) => item.data().type === type);
            }
            if (inputLang !== "Any language") {
                filtered = filtered.filter((item) => item.data().input_lang === inputLang);
            }
            if (outputLang !== "Any language") {
                filtered = filtered.filter((item) => item.data().output_lang === outputLang);
            }

            setFilteredItems(filtered);
            onFilterChange(filtered);
        };

        filterItems();
    }, [type, inputLang, outputLang, searches, onFilterChange]);

    useEffect(() => {
        if (itemCount > filteredItems.length) {
            setItemCount(filteredItems.length)
        }
    }, [itemCount, filteredItems.length, setItemCount])

    return (
        <div className="mb-4">
            <div className={`bg-light text-dark border border-dark rounded-lg drop-shadow px-4 py-2 relative text-start mt-4 hover:cursor-pointer ${isOpen && "rounded-b-none border-b-0 drop-shadow-none"}`} onClick={() => setIsOpen(!isOpen)}>
                <span>FILTER</span>
                <span className={`absolute right-3 ${isOpen ? "rotate-180 top-[12px]" : "top-4"}`}>
                    <Icon type="down-chevron" />
                </span>
            </div>

            {isOpen && (<div className="bg-light border border-dark border-t-0 p-4 text-start rounded-b-lg">
                <label htmlFor="type" className="sr-only">Type</label>
                <div className="relative">
                    <select id="type" value={type} onChange={(e) => setType(e.target.value as "any" | "translate" | "simplify")}>
                        <option value="any">Any type</option>
                        <option value="simplify">Simplify</option>
                        <option value="translate">Translate</option>
                    </select>
                </div>

                <div className="flex flex-row gap-4">
                    <fieldset className="w-1/2">
                        <label className="text-xs" htmlFor="input_language">From </label>
                        <div className="relative">
                            <select id="input_language" onChange={e => setInputLang(e.target.value)} value={inputLang}>
                                {inputLangOptions && (
                                    inputLangOptions && inputLangOptions.map(lang => (
                                        <option key={lang} value={lang}>{lang}</option>
                                    ))
                                )}
                            </select>
                            <span className="absolute top-[18px] right-2">
                                <Icon type="down-chevron" />
                            </span>
                        </div>
                    </fieldset>

                    {type === "translate" && outputLangOptions ? (<fieldset className="w-1/2">
                        <label className="text-xs" htmlFor="output_language">To </label>
                        <div className="relative">
                            <select id="output_language" onChange={e => setOutputLang(e.target.value)} value={outputLang}>
                                {outputLangOptions && outputLangOptions.map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                            <span className="absolute top-[18px] right-2">
                                <Icon type="down-chevron" />
                            </span>
                        </div>
                    </fieldset>) : (<div className="w-1/2"></div>)}
                </div>

                <fieldset>
                    <label htmlFor="number" className="text-xs">Number of phrases</label>
                    <input value={itemCount} type="number" id="number" onChange={e => {
                        const newCount = Math.max(1, Math.min(parseInt(e.target.value) || 1, filteredItems.length));
                        setItemCount(newCount);
                    }} className="w-full" min={1} max={filteredItems.length} />
                </fieldset>

            </div>)}
        </div>
    )
}
