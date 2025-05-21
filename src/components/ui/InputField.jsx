// InputField.jsx

// A text box where users type their questions.

function InputField({ value, onChange, onKeyDown, disabled, ariaDescribedby }) {
  return (
    <input
      type="text"
      id="questionInput"
      placeholder="Ask a question..."
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className="flex-grow p-3 rounded-lg bg-white text-black ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-200 transition-all duration-200"
      disabled={disabled}
      autoComplete="off"
      aria-label="Question input"
      aria-describedby={ariaDescribedby}
    />
  );
}

export default InputField;
