import type { ComponentProps } from "react";

import { inputError, inputNormal, labelClass } from "./formFieldStyles";

type FormTextareaFieldProps = {
  id: string;
  label: string;
  error?: string;
} & Omit<ComponentProps<"textarea">, "id">;

export function FormTextareaField({
  id,
  label,
  error,
  className,
  ...textareaProps
}: FormTextareaFieldProps) {
  const errorId = `${id}-error`;
  const base = error ? inputError : inputNormal;
  const mergedClass = [base, "min-h-[120px] resize-y", className].filter(Boolean).join(" ");

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <textarea
        id={id}
        className={mergedClass}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        {...textareaProps}
      />
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
