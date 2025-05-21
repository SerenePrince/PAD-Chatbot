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
        true
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
    <div className="text-white font-sans bg-black min-h-screen">
      {/* Toast messages appear here */}
      <Toaster position="top-center" toastOptions={{ style: TOAST_STYLE }} />

      {/* Main chatbot area */}
      <main className="bg-gradient-to-bl from-indigo-950 to-black py-12 px-4 flex flex-col items-center min-h-screen max-h-screen">
        <h1 className="text-4xl font-bold mb-2 text-center text-white">
          {APP_TITLE}
        </h1>
        <p className="text-md text-indigo-300 text-center max-w-3xl">
          {APP_DESCRIPTION}
        </p>

        {/* Form with input and submit button */}
        <form
          onSubmit={handleSubmit}
          className="mt-3 flex w-full max-w-3xl gap-3 px-4"
        >
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

        {/* Chat history */}
        <div
          ref={scrollRef}
          className="w-full max-w-3xl px-4 mt-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600"
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
      </main>

      {/* Frequently Asked Questions */}
      <FAQSection items={FAQ_ITEMS} />
    </div>
  );
}

export default App;
