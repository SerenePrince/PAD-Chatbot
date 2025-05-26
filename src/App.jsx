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
  const [qaList, setQaList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const latestRef = useRef(null);
  const faqRef = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    if (latestRef.current) {
      latestRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [qaList]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      toast.error("Please enter a question", { style: TOAST_STYLE });
      return;
    }

    setIsLoading(true);
    setQuestion("");
    setQaList((prev) => [
      ...prev,
      { question: trimmed, answer: "", isPending: true },
    ]);

    try {
      const answer = await askChatbot(trimmed);
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
    <div className="flex min-h-screen flex-col items-center gap-12 bg-sky-50 p-6 font-sans">
      <Toaster position="top-center" toastOptions={{ style: TOAST_STYLE }} />

      {/* Wrap the main content in an article tag since it's self-contained content */}
      <article className="w-full">
        <main
          ref={mainRef}
          className={`flex max-w-4xl flex-col items-center rounded-2xl bg-white p-6 shadow-md transition-all duration-500 ${
            qaList.length === 0 ? "justify-evenly" : "min-h-[calc(100vh-80px)]"
          } mx-auto`} // Added mx-auto for better centering
        >
          {/* Header Section - wrapped in header tag */}
          <header
            className={`flex flex-col items-center transition-all duration-500 ${
              qaList.length === 0 ? "mb-8" : "mb-6"
            }`}
          >
            <div className="flex flex-row items-center space-x-3">
              <img
                src={PADLogo}
                className="w-16 transition-all duration-500 md:w-20"
                alt="PAD logo"
                aria-hidden="true" // Since the text alternative is already in the heading
              />
              <h1 className="text-3xl font-semibold tracking-wide text-sky-600 md:text-4xl">
                {APP_TITLE}
              </h1>
            </div>

            <p className="mt-3 max-w-2xl text-center text-lg text-zinc-700">
              {APP_DESCRIPTION}
            </p>
          </header>

          {/* Chat history - improved semantics */}
          <section
            aria-label="Chat conversation"
            className={`w-full max-w-3xl transition-all duration-500 ${
              qaList.length === 0
                ? "max-h-0 opacity-0"
                : "mb-6 max-h-[55vh] min-h-[55vh] flex-1 opacity-100"
            }`}
          >
            <ol
              role="log"
              className="scrollbar-thin scrollbar-thumb-sky-200 scrollbar-track-transparent max-h-[55vh] space-y-4 overflow-y-auto pr-2"
            >
              {qaList.map((entry, i) => (
                <li key={i}>
                  <QAEntry
                    entry={entry}
                    entryRef={i === qaList.length - 1 ? latestRef : null}
                  />
                </li>
              ))}
            </ol>
          </section>

          {/* Input Section - wrapped in a form element */}
          <form
            onSubmit={handleSubmit}
            className={`w-full max-w-3xl transition-all duration-500 ${
              qaList.length === 0 ? "mt-0" : "mt-auto"
            }`}
            aria-label="Chat input form"
          >
            <div className="flex w-full gap-3">
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
            </div>

            <p
              id="questionHelp"
              className="mt-4 text-center text-sm text-zinc-600"
            >
              <span className="font-semibold">AI-Generated Content</span> —
              These responses are produced by an AI model that searches the PAD
              for relevant passages. Always double-check important details in
              the official PAD document.
            </p>
          </form>

          {/* Scroll to FAQ button - moved outside main */}
          <button
            className={`${
              qaList.length === 0
                ? "h-0 opacity-0"
                : "mt-6 cursor-pointer rounded-full bg-sky-500 p-2 font-semibold text-white opacity-100 shadow-sm transition-all duration-500 hover:bg-sky-600 focus:outline-none"
            }`}
            aria-label="Scroll to FAQ section"
            onClick={scrollToFAQ}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </main>
      </article>

      {/* FAQ Section - now uses aside since it's related but separate content */}
      <aside
        ref={faqRef}
        aria-label="Frequently asked questions"
        className="w-full max-w-4xl"
      >
        <FAQSection items={FAQ_ITEMS} />
      </aside>
    </div>
  );
}

export default App;
