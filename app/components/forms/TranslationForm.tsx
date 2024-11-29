"use client";

import { useGetLanguageList } from '@/app/hooks/useGetLanguageList';
import { TranslationFormFields, TranslationFormSchema } from '@/app/types/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'

export const TranslationForm = () => {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<TranslationFormFields>({
        defaultValues: {
            type: "translate",
            input_language: "en",
            output_language: "sv",
            input: "",
        },
        resolver: zodResolver(TranslationFormSchema)
    })
    const { loading, error, result: languages } = useGetLanguageList();
    const selectedType = watch("type");
    const selectedInputLanguage = watch("input_language");
    const selectedOutputLanguage = watch("output_language");
    const inputText = watch("input");

    const onSubmit: SubmitHandler<TranslationFormFields> = (data) => {
        console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col justify-start">
            <div className="flex flex-row mb-8 rounded-full w-fit mx-auto bg-light drop-shadow">
                <div className={selectedType === "translate" ? 'selected toggle' : 'toggle'}>
                    <label htmlFor="translate">TRANSLATE</label>
                    <input
                        className="appearance-none"
                        type="radio"
                        id="translate"
                        value="translate"
                        {...register("type")}
                    />
                </div>

                <div className={selectedType === "simplify" ? 'selected toggle' : 'toggle'}>
                    <label htmlFor="simplify">SIMPLIFY</label>
                    <input
                        className="appearance-none"
                        type="radio"
                        id="simplify"
                        value="simplify"
                        {...register("type")}
                    />
                </div>
            </div>

            {error ? (
                <span>{error}</span>
            ) : (
                <div className="flex flex-row gap-4">
                    <label htmlFor="input_language" className="sr-only">Input language</label>
                    <select id="input_language" {...register("input_language")} value={selectedInputLanguage}>
                        {loading && <option>Loading...</option>}
                        {languages && languages.map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                    </select>

                    <label htmlFor="output_language" className="sr-only">Output language</label>
                    <select {...register("output_language")} id="output_language" value={selectedOutputLanguage}>
                        {loading && <option>Loading...</option>}
                        {languages && languages.map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="relative">
                <label htmlFor="input" className="sr-only">Input</label>
                <textarea {...register("input")} id="input"></textarea>
                <span className="absolute right-2 bottom-7 text-xs text-dark text-opacity-90">{inputText.length}/500</span>
            </div>
            <button type="submit" className="ml-auto" disabled={isSubmitting}>Submit</button>
            {errors && <span>{errors.root?.message}</span>}
        </form>
    )
}