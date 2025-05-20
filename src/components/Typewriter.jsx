import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

/**
 * @function Typewriter
 * @description Renders text with a typewriter effect, displaying it character by character.
 * Supports Markdown formatting in the text.
 * @param {object} props - The component's props.
 * @param {string} props.text - The text to be displayed with the typewriter effect.
 * @param {number} [props.speed=20] - The speed of the typewriter effect in milliseconds per character.
 * @returns {JSX.Element} The text rendered with the typewriter effect (using ReactMarkdown).
 */
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
