import { useMemo, useState } from "react";
import type { Expense } from "./models/expense";
import { ExpensesFilters } from "./components/ExpensesFilters";
import { ExpensesTable } from "./components/ExpensesTable";
import { ExpenseForm } from "./components/ExpenseForm";
import { Header } from "./components/Header";

export function ExpensesPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [expenses, setExpenses] = useState<Expense[]>([]);

  function deleteExpense(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  function addExpense(data: Omit<Expense, "id">) {
    setExpenses((prev) => [...prev, { ...data, id: crypto.randomUUID() }]);
  }

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
          <ExpensesTable items={filtered} onDelete={deleteExpense} />
          <ExpenseForm onSubmit={addExpense} />
        </main>
      </div>
    </div>
  );
}
