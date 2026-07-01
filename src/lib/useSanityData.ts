import { useQuery } from "@tanstack/react-query";
import { sanityFetch, isSanityConfigured } from "./sanity";

export function useSanityQuery<T>(
  queryKey: string[],
  groqQuery: string,
  params?: Record<string, unknown>,
  enabled = true
) {
  return useQuery<T | null>({
    queryKey,
    queryFn: () => {
      if (!isSanityConfigured) return Promise.resolve(null);
      return sanityFetch<T>(groqQuery, params);
    },
    enabled: enabled && isSanityConfigured,
    staleTime: 1000 * 60 * 5,
  });
}