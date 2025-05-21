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
 * @description The main component of the AI chatbot application.
 * Manages the user input, chat history, and interaction with the chatbot API.
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  /**
   * @state {string} question
   * @description The current value of the user's input question.
   */
  const [question, setQuestion] = useState("");

  /**
   * @state {Array<object>} qaList
   * @description An array of question-answer objects representing the chat history.
   * Each object has the structure: `{ question: string, answer: string, isPending?: boolean, isError?: boolean }`.
   */
  const [qaList, setQaList] = useState([]);

  /**
   * @state {boolean} isLoading
   * @description A boolean indicating whether the chatbot is currently processing a request.
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * @constant {React.RefObject<HTMLDivElement>} scrollRef
   * @description A React ref used to access the chat history container for scrolling.
   */
  const scrollRef = useRef(null);

  /**
   * @constant {React.RefObject<HTMLDivElement>} latestRef
   * @description A React ref used to access the latest QA entry to facilitate scrolling.
   */
  const latestRef = useRef(null);

  /**
   * @useEffect
   * @description Scrolls the chat history to the latest message whenever the `qaList` updates.
   * Uses the `scrollRef` and `latestRef` to calculate the scroll position.
   * @dependency {Array<object>} qaList - Effect runs when the chat history updates.
   */
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

  /**
   * @function updateLastMessage
   * @description Updates the last message in the `qaList` with the chatbot's answer or an error.
   * @param {string} question The original user question.
   * @param {string} answer The chatbot's response or an error message.
   * @param {boolean} [isError=false] Indicates if the update is due to an error.
   */
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

  /**
   * @async
   * @function handleSubmit
   * @description Handles the submission of the user's question.
   * Sends the question to the chatbot API and updates the UI accordingly.
   * @param {React.FormEvent} e The form submit event.
   */
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
        true
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @function handleKeyDown
   * @description Handles the key down event in the input field to allow submitting with Enter (without Shift).
   * @param {React.KeyboardEvent<HTMLInputElement>} e The keyboard event.
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      handleSubmit(e);
    }
  };

  return (
    <div className="text-white font-sans bg-black min-h-screen">
      <Toaster position="top-center" toastOptions={{ style: TOAST_STYLE }} />

      <main className="bg-gradient-to-bl from-indigo-950 to-black py-12 px-4 flex flex-col items-center min-h-screen max-h-screen">
        <h1 className="text-4xl font-bold mb-2 text-center text-white">
          {APP_TITLE}
        </h1>
        <p className="text-md text-indigo-300 text-center max-w-3xl">
          {APP_DESCRIPTION}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-3 flex w-full max-w-3xl gap-3 px-4"
        >
          <InputField
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-describedby="questionHelp" // Associate input with help text if needed
          />
          <SubmitButton
            disabled={!question.trim() || isLoading}
            onClick={handleSubmit}
          />
        </form>
        {/* Optional help text for the input */}
        {/* <div id="questionHelp" className="text-xs text-indigo-400 mt-1">Press Enter to submit.</div> */}

        <div
          ref={scrollRef}
          className="w-full max-w-3xl px-4 mt-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600"
          aria-live="polite"
          aria-atomic="false" // Only announce changes within this region
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

      <FAQSection items={FAQ_ITEMS} />
    </div>
  );
}

export default App;
