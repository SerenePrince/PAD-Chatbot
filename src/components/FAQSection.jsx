// FAQSection.jsx

// Shows a list of frequently asked questions and answers.

function FAQSection({ items }) {
  return (
    <section className="bg-indigo-950 py-12 px-4" aria-labelledby="faq-title">
      <div className="max-w-3xl mx-auto">
        <h3
          id="faq-title"
          className="text-2xl font-bold mb-6 text-center text-white"
        >
          Frequently Asked Questions
        </h3>
        <ul className="space-y-6 text-indigo-200">
          {items.map(({ question, answer }, i) => (
            <li key={i}>
              <p className="font-semibold">Q: {question}</p>
              <p className="text-indigo-300 mt-1">A: {answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default FAQSection;
