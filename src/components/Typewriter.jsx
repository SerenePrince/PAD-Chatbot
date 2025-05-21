// Typewriter.jsx

// Shows the chatbot’s response one character at a time, like a typewriter.
// Supports basic formatting (like bold, lists) using Markdown.

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

function Typewriter({ text, speed = 20 }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div aria-live="polite">
      <ReactMarkdown>{displayedText}</ReactMarkdown>
    </div>
  );
}

export default Typewriter;
