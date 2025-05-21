// SubmitButton.jsx

// The button users click to send their question to PAD-Bot.

function SubmitButton({ onClick, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`px-5 py-3 font-semibold rounded-lg transition ${
        !disabled
          ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
          : "bg-indigo-300 cursor-not-allowed"
      }`}
      aria-label="Submit your question"
      onClick={onClick}
    >
      Submit
    </button>
  );
}

export default SubmitButton;
