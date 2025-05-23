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
      className="space-y-2 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-800 shadow-sm"
    >
      <p className="font-semibold text-zinc-900">{question}</p>

      {isPending ? (
        <div className="flex items-center justify-center">
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
