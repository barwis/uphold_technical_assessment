import { renderHook, waitFor, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("returns debounced value after delay", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated", delay: 500 });
    expect(result.current).toBe("initial");

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current).toBe("updated");
    });
  });

  it("resets timer when value changes before delay", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    rerender({ value: "first", delay: 500 });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    rerender({ value: "second", delay: 500 });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("initial");

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(result.current).toBe("second");
    });
  });

  it("works with different delay values", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 1000 },
      }
    );

    rerender({ value: "updated", delay: 1000 });

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe("initial");

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current).toBe("updated");
    });
  });

  it("works with numbers", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 0, delay: 500 },
      }
    );

    expect(result.current).toBe(0);

    rerender({ value: 100, delay: 500 });
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(result.current).toBe(100);
    });
  });

  it("cleans up timer on unmount", () => {
    const { unmount } = renderHook(() => useDebounce("test", 500));

    const spy = jest.spyOn(global, "clearTimeout");
    unmount();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
