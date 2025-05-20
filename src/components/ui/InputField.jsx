/**
 * @function InputField
 * @description A controlled input field for the user to type their questions.
 * @param {object} props - The component's props.
 * @param {string} props.value - The current value of the input field.
 * @param {function} props.onChange - Callback function triggered when the input value changes.
 * @param {function} props.onKeyDown - Callback function triggered when a key is pressed down in the input.
 * @param {boolean} props.disabled - If true, the input field is disabled.
 * @param {string} [props.aria-describedby] - IDs of the elements that describe the input field.
 * @returns {JSX.Element} The rendered input field.
 */
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
