// SubmitButton.jsx

// The button users click to send their question to PAD-Bot.

function SubmitButton({ onClick, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`rounded-xl px-5 py-3 font-semibold text-white shadow-sm transition ${
        !disabled
          ? "cursor-pointer bg-indigo-600 hover:bg-indigo-700"
          : "cursor-not-allowed bg-indigo-300"
      }`}
      aria-label="Submit your question"
      onClick={onClick}
    >
      Submit
    </button>
  );
}

export default SubmitButton;
