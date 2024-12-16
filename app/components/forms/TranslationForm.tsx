"use client";

import { useAddSearch } from '@/app/hooks/useAddSearch';
import useAuth from '@/app/hooks/useAuth';
import { useGetLanguageList } from '@/app/hooks/useGetLanguageList';
import { TranslationFormFields, TranslationFormSchema } from '@/app/types/forms'
import { SearchItemType } from '@/app/types/searches';
import { zodResolver } from '@hookform/resolvers/zod'
import { FirebaseError } from 'firebase/app';
import { Timestamp } from 'firebase/firestore';
import { SubmitHandler, useForm } from 'react-hook-form'

export const TranslationForm = () => {
    const { currentUser } = useAuth();
    const { handleAddSearch, error: addingError, addingLoading, success } = useAddSearch(currentUser?.uid)
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
    const selectedType = watch("type");
    const selectedInputLanguage = watch("input_language");
    const selectedOutputLanguage = watch("output_language");
    const inputText = watch("input");

    const onSubmit: SubmitHandler<TranslationFormFields> = async (data) => {
        const newSearch: SearchItemType = {
            input_lang: data.input_language,
            output_lang: data.output_language,
            input: data.input,
            output: "Here be output",
            created_at: Timestamp.fromDate(new Date())
        }

        if (currentUser) {
            try {
                await handleAddSearch(newSearch)
            } catch (error) {
                setError("root", { message: error instanceof (Error || FirebaseError) ? error.message : "Couldn't add search to My Searches" })
            }
        }
    }

    return (
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
                        <svg className="absolute top-[18px] right-2" width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.695895 1.80319L0.6959 1.8032L0.697791 1.80131L1.80131 0.697792C2.06608 0.433019 2.49021 0.435752 2.74759 0.695896L2.74758 0.695901L2.74947 0.697792L7.45651 5.40482L7.81006 5.75838L8.16361 5.40482L12.8706 0.697792C13.1354 0.433019 13.5595 0.435752 13.8169 0.695901L13.8188 0.697792L14.9223 1.80131C15.1871 2.06608 15.1844 2.49021 14.9242 2.74758L14.9223 2.74947L8.2817 9.3901L8.28168 9.39008L8.27792 9.39392C8.02688 9.65042 7.60427 9.65595 7.33842 9.3901L0.697791 2.74947C0.433018 2.4847 0.435751 2.06057 0.695895 1.80319Z" fill="currentColor" />
                        </svg>
                    </div>

                    {selectedType !== "simplify" ? (<div className="output-lang-container relative  w-1/2">
                        <label htmlFor="output_language" className="sr-only">Output language</label>
                        <select {...register("output_language")} id="output_language" value={selectedOutputLanguage}>
                            {loading && <option>Loading...</option>}
                            {languages && languages.map(lang => (
                                <option key={lang.code} value={lang.name}>{lang.name}</option>
                            ))}
                        </select>
                        <svg className="absolute top-[18px] right-2" width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.695895 1.80319L0.6959 1.8032L0.697791 1.80131L1.80131 0.697792C2.06608 0.433019 2.49021 0.435752 2.74759 0.695896L2.74758 0.695901L2.74947 0.697792L7.45651 5.40482L7.81006 5.75838L8.16361 5.40482L12.8706 0.697792C13.1354 0.433019 13.5595 0.435752 13.8169 0.695901L13.8188 0.697792L14.9223 1.80131C15.1871 2.06608 15.1844 2.49021 14.9242 2.74758L14.9223 2.74947L8.2817 9.3901L8.28168 9.39008L8.27792 9.39392C8.02688 9.65042 7.60427 9.65595 7.33842 9.3901L0.697791 2.74947C0.433018 2.4847 0.435751 2.06057 0.695895 1.80319Z" fill="currentColor" />
                        </svg>
                    </div>) : (<div className="w-1/2"></div>)}
                </div>
            )}

            <div className="relative">
                <label htmlFor="input" className="sr-only">Input</label>
                <textarea {...register("input")} id="input"></textarea>
                <span className="absolute right-2 bottom-3 text-xs text-dark text-opacity-90">{inputText.length}/500</span>
            </div>
            <button type="submit" className="btn-primary ml-auto" disabled={isSubmitting}>Submit</button>

            {addingLoading && <div>Adding to My searches...</div>}
            {addingError && <span className="error">{addingError}</span>}
            {errors && <span>{errors.root?.message}</span>}

            {success && !addingLoading && !addingError && (
                <div className="text-green-500 mt-4">Search added successfully!</div>
            )}
        </form>
    )
}