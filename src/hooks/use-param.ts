import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

let pendingParams: URLSearchParams | null = null;
let flushPromise: Promise<void> | null = null;

export function useParam<T extends string = string>(key: string, defaultValue: string = "") {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = (searchParams.get(key) as T) ?? (defaultValue as T);

  const setValue = useCallback(
    (newValue: T | null) => {
      if (!pendingParams) {
        const currentQuery =
          typeof window !== "undefined"
            ? window.location.search
            : "";
        pendingParams = new URLSearchParams(currentQuery);
      }

      if (newValue === null || newValue === "" || newValue === defaultValue) {
        pendingParams.delete(key);
      } else {
        pendingParams.set(key, newValue);
      }

      if (!flushPromise) {
        flushPromise = Promise.resolve().then(() => {
          if (pendingParams) {
            router.replace(`${pathname}?${pendingParams.toString()}`, {
              scroll: false,
            });
            pendingParams = null;
            flushPromise = null;
          }
        });
      }
    },
    [key, pathname, router, defaultValue]
  );

  return [value, setValue] as const;
}

export function useNumberParam(key: string, defaultValue: number) {
  const [strValue, setStrValue] = useParam(key, defaultValue.toString());

  const value = strValue ? Number(strValue) : defaultValue;

  const setValue = useCallback(
    (newValue: number) => {
      setStrValue(newValue.toString());
    },
    [setStrValue]
  );

  return [value, setValue] as const;
}
