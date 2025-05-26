// InputField.jsx

// A text box where users type their questions.

function InputField({ value, onChange, onKeyDown, disabled, ariaDescribedby }) {
  return (
    <input
      type="text"
      id="questionInput"
      placeholder="Type your PAD question here..."
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className="flex-grow rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-800 shadow-sm transition-all duration-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
      disabled={disabled}
      autoComplete="off"
      aria-label="Question input"
      aria-describedby={ariaDescribedby}
    />
  );
}

export default InputField;
