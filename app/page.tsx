import APIButton from "./components/APIButton";

export default function Home() {
  return (
    <main>
      <h2>Learn</h2>

      <APIButton />

      <div className="flex flex-row gap-8 justify-center mb-12">
        <span>TRANSLATE</span>
        <span>SIMPLIFY</span>
      </div>

      <form action="" className="w-full flex flex-col justify-start">
        <div className="flex flex-row gap-4">
          <label htmlFor="input-language" className="sr-only">Input language</label>
          <select name="input-language" id="input-language">
            <option value="sv">Svenska</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>

          <label htmlFor="output-language" className="sr-only">Output language</label>
          <select name="output-language" id="output-language">
            <option value="en">English</option>
            <option value="sv">Svenska</option>
            <option value="es">Español</option>
          </select>
        </div>

        <label htmlFor="input" className="sr-only">Input</label>
        <textarea name="input" id="input"></textarea>

        <button type="submit" className="ml-auto">Submit</button>
      </form>
    </main>
  );
}
