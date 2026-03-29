import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ContactFormValues } from "../lib/strapi.types";

import { useContactFormSubmit } from "./useContactFormSubmit";

const sampleValues: ContactFormValues = {
  name: "Ana",
  email: "ana@example.com",
  phone: "",
  message: "Hola mundo",
};

vi.mock("../lib/contact/sendContactForm", () => ({
  sendContactForm: vi.fn(),
}));

import { sendContactForm } from "../lib/contact/sendContactForm";

const mockedSend = vi.mocked(sendContactForm);

describe("useContactFormSubmit", () => {
  afterEach(() => {
    mockedSend.mockReset();
  });

  it("sets submitOk and calls onSuccess when sendContactForm returns ok", async () => {
    mockedSend.mockResolvedValue({ ok: true });
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useContactFormSubmit({ onSuccess }));

    await act(async () => {
      await result.current.submit(sampleValues);
    });

    expect(result.current.submitOk).toBe(true);
    expect(result.current.submitError).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(mockedSend).toHaveBeenCalledWith(sampleValues);
  });

  it("sets submitError when sendContactForm returns ok: false", async () => {
    mockedSend.mockResolvedValue({ ok: false, message: "Error del servidor" });

    const { result } = renderHook(() => useContactFormSubmit());

    await act(async () => {
      await result.current.submit(sampleValues);
    });

    expect(result.current.submitOk).toBe(false);
    expect(result.current.submitError).toBe("Error del servidor");
    expect(result.current.isSubmitting).toBe(false);
  });

  it("ignores a second submit while the first is still in flight", async () => {
    mockedSend.mockImplementation(
      () =>
        new Promise(() => {
          /* never resolves */
        }),
    );

    const { result } = renderHook(() => useContactFormSubmit());

    await act(async () => {
      void result.current.submit(sampleValues);
      void result.current.submit(sampleValues);
    });

    expect(mockedSend).toHaveBeenCalledTimes(1);
  });

  it("allows another submit after the first finishes", async () => {
    mockedSend.mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useContactFormSubmit());

    await act(async () => {
      await result.current.submit(sampleValues);
    });

    await act(async () => {
      await result.current.submit(sampleValues);
    });

    expect(mockedSend).toHaveBeenCalledTimes(2);
  });

  it("exposes isSubmitting true while the request is pending", async () => {
    let resolvePromise!: (value: { ok: true }) => void;
    const pending = new Promise<{ ok: true }>((res) => {
      resolvePromise = res;
    });
    mockedSend.mockReturnValue(pending);

    const { result } = renderHook(() => useContactFormSubmit());

    act(() => {
      void result.current.submit(sampleValues);
    });

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(true);
    });

    await act(async () => {
      resolvePromise({ ok: true });
      await pending;
    });

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
  });
});
