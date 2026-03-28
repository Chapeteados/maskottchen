import type { ComponentProps } from "react";

import { inputError, inputNormal, labelClass } from "./formFieldStyles";

type FormTextFieldProps = {
  id: string;
  label: string;
  error?: string;
} & Omit<ComponentProps<"input">, "id">;

export function FormTextField({ id, label, error, className, ...inputProps }: FormTextFieldProps) {
  const errorId = `${id}-error`;
  const mergedClass = [error ? inputError : inputNormal, className].filter(Boolean).join(" ");

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        className={mergedClass}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
