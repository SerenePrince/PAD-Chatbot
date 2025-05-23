// FAQSection.jsx

// Shows a list of frequently asked questions and answers.

function FAQSection({ items }) {
  return (
    <section className="bg-sky-50 px-4 py-12" aria-labelledby="faq-title">
      <div className="mx-auto max-w-3xl">
        <h3
          id="faq-title"
          className="mb-6 text-center text-3xl font-semibold text-sky-500"
        >
          Frequently Asked Questions
        </h3>
        <ul className="space-y-6 text-zinc-800">
          {items.map(({ question, answer }, i) => (
            <li
              key={i}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm"
            >
              <p className="font-semibold text-zinc-900">{question}</p>
              <p className="mt-1 text-zinc-800">{answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default FAQSection;
