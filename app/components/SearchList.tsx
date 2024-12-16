import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Icon } from "./Icon";
import { SearchItemType } from "../types/searches";

export const SearchList = ({ docs }: { docs: QueryDocumentSnapshot<SearchItemType, DocumentData>[] }) => {

    return (
        <>
            {docs && (<ul className="bg-light rounded-lg">
                {docs.map(doc => (
                    <li key={doc.id} className="text-start border border-transparent border-b-dark p-4 flex flex-row justify-between">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px]">{doc.data().input_lang} - {doc.data().output_lang}</span>
                            <p className="font-[helvetica]">{doc.data().input}</p>
                            <p className="font-bold font-[helvetica]">{doc.data().output}</p>
                        </div>
                        <div>
                            <span className="hover:cursor-pointer" role="button"><Icon type="delete" /></span>
                        </div>
                    </li>
                ))}
            </ul>)}
        </>
    )
}
