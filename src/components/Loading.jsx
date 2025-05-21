// Loading.jsx

// A simple animated loading indicator (3 bouncing dots).

function Loading({ ariaLabel }) {
  return (
    <div
      className="flex space-x-1 items-center"
      role="status"
      aria-label={ariaLabel}
    >
      {[0, 0.2, 0.4].map((delay, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce"
          style={{
            animationDelay: `${delay}s`,
            animationDuration: "0.6s",
            opacity: 0.75,
          }}
        />
      ))}
    </div>
  );
}

export default Loading;
