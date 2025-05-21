// QAEntry.jsx

// Shows a question from the user and the response from PAD-Bot.
// Also shows a loading spinner or an error message if needed.

import Markdown from "react-markdown";
import Loading from "../Loading.jsx";
// import Typewriter from "../Typewriter.jsx"; // Optional: switch in if you want typing effect

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
        )}
        {isError && <p>Error: {answer}</p>}
      </div>
    </div>
  );
}

export default QAEntry;
