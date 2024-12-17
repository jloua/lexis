import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Icon } from "./Icon";
import { SearchItemType } from "../types/searches";

export const SearchList = ({ docs }: { docs: QueryDocumentSnapshot<SearchItemType, DocumentData>[] }) => {

    return (
        <>
            {docs && (<ul className="rounded-lg">
                {docs.map(doc => {
                    const { type, input_lang, output_lang, input, output } = doc.data();
                    const typeTitle = type === "simplify" ? "Simplification" : "Translation"

                    return (
                        <li key={doc.id}>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px]">{input_lang} {output_lang && `- ${output_lang}`}</span>
                                <p className="font-[helvetica]">{input}</p>
                                <p className="font-bold font-[helvetica]">{output}</p>
                            </div>
                            <div className="flex flex-col justify-between items-end">
                                <span className="text-[10px] text-darkBlue">{typeTitle}</span>
                                <span className="hover:cursor-pointer pb-1" role="button"><Icon type="delete" /></span>
                            </div>
                        </li>
                    )
                })}
            </ul>)}
        </>
    )
}
