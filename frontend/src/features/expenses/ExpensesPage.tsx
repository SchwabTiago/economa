import { useEffect, useMemo, useState } from "react";
import type { Expense } from "./models/expense";
import { ExpensesFilters } from "./components/ExpensesFilters";
import { ExpensesTable } from "./components/ExpensesTable";
import { ExpenseForm } from "./components/ExpenseForm";
import { Header } from "./components/Header";
import { economaApi } from "../../shared/api/economaApi";

export function ExpensesPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    economaApi
      .listTransactions({ month, year }, ctrl.signal)
      .then((res) => setExpenses(res.items))
      .catch((e) => {
        // Ignore abort
        if ((e as any)?.name === "AbortError") return;
        setError((e as Error).message || "Falha ao carregar lançamentos");
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [month, year]);

  async function deleteExpense(id: string) {
    try {
      setDeletingId(id);
      setError(null);
      await economaApi.deleteTransaction(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      setError((e as Error).message || "Falha ao apagar lançamento");
    } finally {
      setDeletingId(null);
    }
  }

  async function addExpense(data: Omit<Expense, "id">) {
    try {
      setSaving(true);
      setError(null);

      const created = await economaApi.createTransaction(data);

      // Só adiciona na lista atual se o lançamento for do mês/ano selecionado.
      const d = new Date(created.paidAt);
      const matches = d.getMonth() + 1 === month && d.getFullYear() === year;
      if (matches) setExpenses((prev) => [created, ...prev]);
    } catch (e) {
      setError((e as Error).message || "Falha ao cadastrar lançamento");
    } finally {
      setSaving(false);
    }
  }

  // A API já devolve por mês/ano, mas mantemos o filtro como defesa.
  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const d = new Date(e.paidAt);
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    });
  }, [expenses, month, year]);

  const totalCents = filtered.reduce((acc, e) => {
    return e.type === "expense" ? acc - e.amountCents : acc + e.amountCents;
  }, 0);

  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <Header />
      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-6">
        <ExpensesFilters
          month={month}
          year={year}
          totalCents={totalCents}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />

        <main className="col-span-9 space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <ExpensesTable
            items={filtered}
            onDelete={deleteExpense}
            deletingId={deletingId}
            loading={loading}
          />

          <ExpenseForm onSubmit={addExpense} disabled={saving} />
        </main>
      </div>
    </div>
  );
}
