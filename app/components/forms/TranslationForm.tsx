"use client";

import { useAddSearch } from '@/app/hooks/useAddSearch';
import useAuth from '@/app/hooks/useAuth';
import useGeminiAPI from '@/app/hooks/useGeminiAPI';
import { useGetLanguageList } from '@/app/hooks/useGetLanguageList';
import { TranslationFormFields, TranslationFormSchema } from '@/app/types/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { FirebaseError } from 'firebase/app';
import { Timestamp } from 'firebase/firestore';
import { SubmitHandler, useForm } from 'react-hook-form'
import { Icon } from '../Icon';

export const TranslationForm = () => {
    const { currentUser } = useAuth();
    const { handleAddSearch, error: addingError, addingLoading } = useAddSearch(currentUser?.uid)
    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setError } = useForm<TranslationFormFields>({
        defaultValues: {
            type: "translate",
            input_language: "English",
            output_language: "Swedish",
            input: "",
        },
        resolver: zodResolver(TranslationFormSchema)
    })
    const { loading, error, result: languages } = useGetLanguageList();
    const { loading: geminiLoading, error: geminiError, result, resetResult, postGeminiRequest } = useGeminiAPI();
    const selectedType = watch("type");
    const selectedInputLanguage = watch("input_language");
    const selectedOutputLanguage = watch("output_language");
    const inputText = watch("input");

    const onSubmit: SubmitHandler<TranslationFormFields> = async (data) => {
        resetResult();
        try {
            const geminiOutput = await postGeminiRequest(data)

            if (geminiOutput && currentUser) {
                try {
                    await handleAddSearch({
                        type: data.type,
                        input_lang: data.input_language,
                        output_lang: data.type === "translate" ? data.output_language : null,
                        input: data.input,
                        output: geminiOutput,
                        created_at: Timestamp.fromDate(new Date())
                    })
                } catch (error) {
                    setError("root", { message: error instanceof (Error || FirebaseError) ? error.message : "Couldn't add search to My Searches" })
                }

            }

        } catch (error) {
            setError("root", { message: error instanceof Error ? error.message : "Error reaching Gemini API" })
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col justify-start gap-4 mt-8">
                <div className="flex flex-row mb-2 rounded-full w-fit mx-auto bg-light drop-shadow">
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
                        <div className="input-lang-container relative w-1/2">
                            <label htmlFor="input_language" className="sr-only">Input language</label>
                            <select id="input_language" {...register("input_language")} value={selectedInputLanguage}>
                                {loading && <option>Loading...</option>}
                                {languages && languages.map(lang => (
                                    <option key={lang.code} value={lang.name}>{lang.name}</option>
                                ))}
                            </select>
                            <span className="absolute top-[18px] right-2">
                                <Icon type="down-chevron" />
                            </span>
                        </div>

                        {selectedType !== "simplify" ? (<div className="output-lang-container relative  w-1/2">
                            <label htmlFor="output_language" className="sr-only">Output language</label>
                            <select {...register("output_language")} id="output_language" value={selectedOutputLanguage}>
                                {loading && <option>Loading...</option>}
                                {languages && languages.map(lang => (
                                    <option key={lang.code} value={lang.name}>{lang.name}</option>
                                ))}
                            </select>
                            <span className="absolute top-[18px] right-2">
                                <Icon type="down-chevron" />
                            </span>
                        </div>) : (<div className="w-1/2"></div>)}
                    </div>
                )}

                <div className="relative">
                    <label htmlFor="input" className="sr-only">Input</label>
                    <textarea {...register("input")} id="input"></textarea>
                    <span className="absolute right-2 bottom-3 text-xs text-dark text-opacity-90">{inputText.length}/500</span>
                </div>
                <div className="submit ml-auto">
                    <button type="submit" className="btn-primary" disabled={isSubmitting || addingLoading || geminiLoading}>
                        {selectedType === "translate"
                            ? isSubmitting
                                ? "Translating..."
                                : "Translate"
                            : isSubmitting
                                ? "Simplifying..."
                                : "Simplify"
                        }
                    </button>

                    {addingError && <span className="error w-full">{addingError}</span>}
                    {errors && <span className="error w-full">{errors.root?.message}</span>}
                </div>
            </form>

            <div className="text-start">
                {(geminiError || result) &&
                    <>
                        <p>{result && "Translation:"}{geminiError && "Error:"}</p>
                        <div className="output">
                            {geminiError && <span className="error">{geminiError}</span>}
                            {result && (
                                <p className="font-[helvetica]">{result}</p>
                            )}
                        </div>
                    </>
                }
            </div>
        </>
    )
}