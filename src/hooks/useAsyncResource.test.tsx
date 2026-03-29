import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useAsyncResource } from "./useAsyncResource";

describe("useAsyncResource", () => {
  it("resolves with data and clears loading", async () => {
    const fetcher = vi.fn().mockResolvedValue({ id: 1 });
    const { result } = renderHook(() => useAsyncResource(fetcher, []));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({ id: 1 });
    expect(result.current.error).toBeUndefined();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("sets error when fetcher rejects with Error", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("network"));
    const { result } = renderHook(() => useAsyncResource(fetcher, []));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error?.message).toBe("network");
  });

  it("wraps non-Error rejection in Error", async () => {
    const fetcher = vi.fn().mockRejectedValue("boom");
    const { result } = renderHook(() => useAsyncResource(fetcher, []));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error?.message).toBe("boom");
  });

  it("runs again when deps change", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce("first").mockResolvedValueOnce("second");
    const { result, rerender } = renderHook(
      ({ key }: { key: number }) => useAsyncResource(fetcher, [key]),
      { initialProps: { key: 1 } },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toBe("first");
    expect(fetcher).toHaveBeenCalledTimes(1);

    rerender({ key: 2 });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toBe("second");
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  /** TODO: remove after you confirm CI fails and deploy is blocked */
  it("TEMP — intentional failure to verify CI / Vercel gate", () => {
    throw new Error("Delete this test once the pipeline check is confirmed");
  });
});
