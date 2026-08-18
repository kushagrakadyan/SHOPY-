import { forwardRef, useState } from "react";

const Input = forwardRef(function Input(
  { label, error, hint, type = "text", className = "", id, ...props },
  ref
) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={className}>
      {label && <label htmlFor={inputId} className="label">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={isPassword ? (show ? "text" : "password") : type}
          className={`input ${error ? "!border-red-400 focus:!ring-red-300" : ""} ${isPassword ? "pr-11" : ""}`}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-400 hover:text-ink-700"
            aria-label={show ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {show ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a19.7 19.7 0 015.06-5.94M9.9 4.24A10.94 10.94 0 0112 4c7 0 11 8 11 8a19.9 19.9 0 01-2.16 3.19m-6.3-1.63a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;
