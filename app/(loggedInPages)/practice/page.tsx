import { CustomQuizBuilder } from "@/app/components/forms/CustomQuizBuilder";
import { QuizFilter } from "@/app/components/forms/QuizFilter";

export default function Practice() {
    return (
        <main>
            <h2>Practice</h2>

            <p className="mt-6 text-start">Practice 10 random phrases from your search history.</p>
            <p className="mt-4 text-start">Customize by using filters.</p>

            <QuizFilter />

            <p className="mt-4 text-start">Or pick specific searches.</p>
            <CustomQuizBuilder />
        </main>
    );
}
