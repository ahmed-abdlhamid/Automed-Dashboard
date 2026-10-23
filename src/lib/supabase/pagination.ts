// Advance by the actual row count so lower API caps cannot truncate results.
export async function readAllRows<T>(query: (offset: number) => PromiseLike<{
  data: T[] | null; error: { message: string } | null; count: number | null;
}>) {
  const data: T[] = [];
  while (true) {
    const result = await query(data.length);
    if (result.error) return { data, error: result.error };
    const page = result.data ?? [];
    data.push(...page);
    if (result.count !== null && data.length >= result.count) return { data, error: null };
    if (!page.length) return { data, error: result.count !== null && data.length < result.count
      ? { message: "Incomplete paginated response" } : null };
  }
}
