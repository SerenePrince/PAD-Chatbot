import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { askChatbot } from "./config/settings.js";
import {
  APP_TITLE,
  APP_DESCRIPTION,
  FAQ_ITEMS,
  TOAST_STYLE,
} from "./constants.js";
import InputField from "./components/ui/InputField.jsx";
import SubmitButton from "./components/ui/SubmitButtons.jsx";
import QAEntry from "./components/ui/QAEntry.jsx";
import FAQSection from "./components/FAQSection.jsx";
import PADLogo from "./assets/PAD_Icon.png";

/**
 * @function App
 * @description The main chatbot interface. Users can type questions, submit them,
 * and view responses. Also includes an FAQ section and handles all interaction with the AI API.
 * @returns {JSX.Element} The full chatbot UI.
 */
function App() {
  const [question, setQuestion] = useState("");
  // Current input from the user.

  const [qaList, setQaList] = useState([]);
  // Stores the full chat history (Q&A pairs).

  const [isLoading, setIsLoading] = useState(false);
  // Prevents duplicate requests and disables input while loading.

  const scrollRef = useRef(null);
  // Container element for the chat history – used to scroll to latest response.

  const latestRef = useRef(null);
  // Points to the latest chat entry so we can smoothly scroll to it.

  const faqRef = useRef(null);
  // Ref for the FAQ section to scroll to

  useEffect(() => {
    if (scrollRef.current && latestRef.current) {
      const containerTop = scrollRef.current.getBoundingClientRect().top;
      const entryTop = latestRef.current.getBoundingClientRect().top;
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollTop + (entryTop - containerTop),
        behavior: "smooth",
      });
    }
  }, [qaList]);
  // Scrolls to the newest message every time qaList changes.

  const scrollToFAQ = () => {
    faqRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const updateLastMessage = (question, answer, isError = false) => {
    setQaList((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        question,
        answer,
        isPending: false,
        isError,
      };
      return updated;
    });
  };
  // Called after we get the bot's response (or an error).

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      toast.error("Please enter a question", { style: TOAST_STYLE });
      return;
    }

    setIsLoading(true);
    setQuestion(""); // Clear input
    setQaList((prev) => [
      ...prev,
      { question: trimmed, answer: "", isPending: true },
    ]);

    try {
      const answer = await askChatbot(trimmed); // Call API
      updateLastMessage(trimmed, answer);
    } catch (err) {
      console.error("Chat error:", err);
      toast.error("Failed to get a response.", { style: TOAST_STYLE });
      updateLastMessage(
        trimmed,
        "An error occurred while retrieving a response.",
        true,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Toast messages appear here */}
      <Toaster position="top-center" toastOptions={{ style: TOAST_STYLE }} />

      {/* Main chatbot area */}
      <main className="flex min-h-screen flex-col items-center space-y-3 bg-zinc-50 p-6">
        <div
          className="flex flex-row items-center space-x-3"
          aria-label="App logo and title"
        >
          <img
            src={PADLogo}
            className="w-20"
            alt="PAD logo" // <- Replace this with a more descriptive alt if needed
          />
          <h1 className="text-center text-4xl font-semibold tracking-wide text-sky-500">
            {APP_TITLE}
          </h1>
        </div>

        <p className="text-md max-w-3xl text-center text-zinc-700">
          {APP_DESCRIPTION}
        </p>

        {/* Chat history */}
        <div
          ref={scrollRef}
          className="scrollbar-thin scrollbar-thumb-sky-600 max-h-[70vh] w-full max-w-3xl flex-1 space-y-6 overflow-y-auto py-1"
          aria-live="polite"
        >
          <ol role="log" aria-label="Chat History" className="space-y-4">
            {qaList.map((entry, i) => (
              <li key={i}>
                <QAEntry
                  entry={entry}
                  entryRef={i === qaList.length - 1 ? latestRef : null}
                />
              </li>
            ))}
          </ol>
        </div>

        {/* Form with input and submit button */}
        <form onSubmit={handleSubmit} className="flex w-full max-w-3xl gap-3">
          <InputField
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-describedby="questionHelp"
          />
          <SubmitButton
            disabled={!question.trim() || isLoading}
            onClick={handleSubmit}
          />
        </form>

        <button
          className="cursor-pointer rounded-xl bg-sky-500 px-2 font-semibold text-white shadow-sm transition hover:bg-sky-600"
          aria-label="Submit your question"
          onClick={scrollToFAQ}
        >
          <svg
            className="h-6 w-6 transition-transform group-hover:translate-y-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>{" "}
        </button>
      </main>

      {/* Frequently Asked Questions */}
      <div ref={faqRef}>
        <FAQSection items={FAQ_ITEMS} />
      </div>
    </div>
  );
}

export default App;
