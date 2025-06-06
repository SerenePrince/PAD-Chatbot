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
      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:border-sky-200"
    >
      <p className="font-semibold text-zinc-900">{question}</p>

      {isPending ? (
        <div className="mt-3 flex items-center justify-center">
          <Loading aria-label="Loading response" />
        </div>
      ) : (
        <Markdown>{answer}</Markdown>
      )}

      {isError && <p className="text-red-600">Error: {answer}</p>}
    </div>
  );
}

export default QAEntry;
