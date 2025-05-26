// Updated FAQSection.jsx with consistent styling and semantics
function FAQSection({ items }) {
  return (
    <section
      className="rounded-2xl bg-white p-6 shadow-md"
      aria-labelledby="faq-title"
    >
      <div className="mx-auto max-w-3xl">
        <h3
          id="faq-title"
          className="mb-6 text-center text-3xl font-semibold tracking-wide text-sky-600"
        >
          Frequently Asked Questions
        </h3>
        <ul className="space-y-4 text-zinc-700">
          {items.map(({ question, answer }, i) => (
            <li
              key={i}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:border-sky-200"
            >
              <p className="font-semibold text-zinc-900">{question}</p>
              <p className="mt-2 text-zinc-700">{answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default FAQSection;
