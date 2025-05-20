/**
 * @function SubmitButton
 * @description A button component used to submit the user's question.
 * @param {object} props - The component's props.
 * @param {function} props.onClick - Callback function triggered when the button is clicked.
 * @param {boolean} props.disabled - If true, the button is disabled.
 * @returns {JSX.Element} The rendered submit button.
 */
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
      Ask PAD-Bot
    </button>
  );
}

export default SubmitButton;
