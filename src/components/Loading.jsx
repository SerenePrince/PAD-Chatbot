// Loading.jsx

// A simple animated loading indicator (3 bouncing dots).

function Loading({ ariaLabel }) {
  return (
    <div
      className="flex items-center space-x-1"
      role="status"
      aria-label={ariaLabel}
    >
      {[0, 0.2, 0.4].map((delay, i) => (
        <div
          key={i}
          className="h-2 w-2 animate-bounce rounded-full bg-indigo-300"
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
