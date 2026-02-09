export type TransactionType = "expense" | "income";

export type Transaction = {
  id: string;
  description: string;
  category: string;
  amountCents: number;
  paidAt: string; // YYYY-MM-DD
  type: TransactionType;
};

export type ListTransactionsResponse = {
  items: Transaction[];
  summary: {
    month: number;
    year: number;
    totalCents: number;
  };
};

export type CreateTransactionPayload = Omit<Transaction, "id">;

const DEFAULT_BASE_URL = "http://localhost:3001/api/v1";

function getBaseUrl() {
  // Vite exposes env vars via import.meta.env
  const fromEnv = (import.meta as any).env?.VITE_API_BASE_URL as
    | string
    | undefined;
  return (fromEnv && fromEnv.trim()) || DEFAULT_BASE_URL;
}

class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request<T>(
  path: string,
  init?: RequestInit & { signal?: AbortSignal }
): Promise<T> {
  const url = `${getBaseUrl()}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (res.status === 204) return undefined as T;

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => undefined) : undefined;

  if (!res.ok) {
    const message =
      (body as any)?.error ||
      (body as any)?.message ||
      `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, body);
  }

  return body as T;
}

export const economaApi = {
  listTransactions: (params: { month: number; year: number }, signal?: AbortSignal) => {
    const q = new URLSearchParams({
      month: String(params.month),
      year: String(params.year),
    });
    return request<ListTransactionsResponse>(`/transactions?${q.toString()}`, {
      method: "GET",
      signal,
    });
  },

  createTransaction: (payload: CreateTransactionPayload) =>
    request<Transaction>(`/transactions`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  deleteTransaction: (id: string) =>
    request<void>(`/transactions/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};

export type { ApiError };
