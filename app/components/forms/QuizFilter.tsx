"use client";

import { useState } from "react";
import { Icon } from "../Icon";
import { useGetLanguageList } from "@/app/hooks/useGetLanguageList";
import { SubmitHandler, useForm } from "react-hook-form";
import { QuizFilterSchema, QuizFilterType } from "@/app/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";

export const QuizFilter = () => {
    const { loading, error, result: languages } = useGetLanguageList();
    const [isOpen, setIsOpen] = useState(false);
    const { handleSubmit, register, watch, formState: { errors, isSubmitting } } = useForm<QuizFilterType>({ defaultValues: { type: "translate", number: "10" }, resolver: zodResolver(QuizFilterSchema) });
    const anyLanguageChoice = watch("any_language");
    const typeChoice = watch("type");

    const onSubmit: SubmitHandler<QuizFilterType> = (data) => {
        console.log(data)

        const dataToSend = {
            type: data.type,
            input_language: data.any_language ? null : data.input_language,
            output_language: data.any_language ? null : data.type === "simplify" ? null : data.output_language,
            number: data.number
        }

        console.log(dataToSend)
    }

    return (
        <>
            <div className={`bg-light text-dark border border-dark rounded-lg drop-shadow px-4 py-2 relative text-start mt-4 hover:cursor-pointer ${isOpen && "rounded-b-none border-b-0 drop-shadow-none"}`} onClick={() => setIsOpen(!isOpen)}>
                <span>FILTER</span>
                <span className={`absolute right-3 ${isOpen ? "rotate-180 top-[12px]" : "top-4"}`}>
                    <Icon type="down-chevron" />
                </span>
            </div>

            {isOpen && (
                <div className="bg-light border border-dark border-t-0 p-4 text-start rounded-b-lg">
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col justify-start gap-4 mt-2">
                        <div className="flex flex-row gap-4">
                            <fieldset className="w-1/2">
                                <label htmlFor="any_language">
                                    <input type="checkbox" id="any_language" {...register("any_language")} className="accent-darkBlue" />
                                    <span className="ml-2">
                                        Any languages
                                    </span>
                                </label>
                            </fieldset>
                            <div className="w-1/2"></div>
                        </div>

                        {!anyLanguageChoice && (
                            <div className="flex flex-row gap-4">
                                <fieldset className="w-1/2">
                                    <label className="text-xs" htmlFor="input_language">From </label>
                                    <div className="relative">
                                        <select id="input_language" {...register("input_language")}>
                                            {error && (<span className="error">{error}</span>)}
                                            {loading ? (
                                                <span>Loading...</span>
                                            ) : (
                                                languages && languages.map(lang => (
                                                    <option key={lang.code} value={lang.name}>{lang.name}</option>
                                                ))
                                            )}
                                        </select>
                                        <span className="absolute top-[18px] right-2">
                                            <Icon type="down-chevron" />
                                        </span>
                                    </div>
                                </fieldset>

                                {typeChoice === "translate" ? (<fieldset className="w-1/2">
                                    <label className="text-xs" htmlFor="output_language">To </label>
                                    <div className="relative">
                                        <select id="output_language" {...register("output_language")}>
                                            {loading ? (
                                                <span>Loading...</span>
                                            ) : (
                                                languages && languages.map(lang => (
                                                    <option key={lang.code} value={lang.name}>{lang.name}</option>
                                                ))
                                            )}
                                        </select>
                                        <span className="absolute top-[18px] right-2">
                                            <Icon type="down-chevron" />
                                        </span>
                                    </div>
                                </fieldset>) : (<div className="w-1/2"></div>)}
                            </div>)}

                        <div className="grid grid-cols-2 gap-4">
                            <fieldset>
                                <label htmlFor="number" className="text-xs">Number of phrases</label>
                                <input type="number" id="number" {...register("number")} className="w-full" />
                            </fieldset>

                            <fieldset>
                                <label htmlFor="type" className="text-xs">Type</label>
                                <select id="type" {...register("type")}>
                                    <option value="translate">Translate</option>
                                    <option value="simplify">Simplify</option>
                                </select>
                            </fieldset>
                        </div>

                        <div className="submit ml-auto mt-6">
                            {errors && (
                                <span className="error">{errors.root?.message}</span>
                            )}
                            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? "Generating quiz..." : "Generate quiz"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    )
}
