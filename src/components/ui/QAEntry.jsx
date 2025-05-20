import Markdown from "react-markdown";
import Loading from "../Loading.jsx";
import Typewriter from "../Typewriter.jsx";

/**
 * @function QAEntry
 * @description Displays a single question and its corresponding answer in the chat history.
 * Optionally displays a loading indicator or an error state.
 * @param {object} props - The component's props.
 * @param {object} props.entry - An object containing the question, answer, and status flags.
 * @param {string} props.entry.question - The user's question.
 * @param {string} props.entry.answer - The chatbot's answer.
 * @param {boolean} [props.entry.isPending=false] - Indicates if the answer is currently being fetched.
 * @param {boolean} [props.entry.isError=false] - Indicates if an error occurred while fetching the answer.
 * @param {React.Ref<HTMLDivElement>} [props.entryRef] - An optional ref to this entry's main div element.
 * @returns {JSX.Element} The rendered question and answer entry.
 */
function QAEntry({ entry, entryRef }) {
  const { question, answer, isPending, isError } = entry;

  return (
    <div
      ref={entryRef}
      className="p-4 rounded-xl shadow bg-indigo-950 space-y-3 border border-indigo-800"
    >
      <p className="font-semibold text-indigo-100">User: {question}</p>
      <div
        className={`p-3 rounded-md text-sm leading-relaxed ${
          isPending
            ? "flex justify-center text-indigo-100"
            : isError
            ? "bg-red-900 text-red-100"
            : "bg-indigo-800 text-indigo-100"
        }`}
        aria-live={isPending ? "polite" : "off"}
      >
        {isPending ? (
          <Loading aria-label="Loading response" />
        ) : (
          <>
            <p className="font-semibold text-indigo-100">PAD-Bot:</p>
            <Markdown>{answer}</Markdown>
          </>
          // <Typewriter text={answer} />
        )}
        {isError && <p>Error: {answer}</p>}
      </div>
    </div>
  );
}

export default QAEntry;
