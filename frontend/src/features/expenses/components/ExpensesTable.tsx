import type { Expense } from "../models/expense";
import { Card } from "../../../shared/ui/Card";

type Props = {
  items: Expense[];
  onDelete: (id: string) => void;
  loading?: boolean;
  deletingId?: string | null;
};

export function ExpensesTable({ items, onDelete, loading, deletingId }: Props) {
  return (
    <Card>
      <h3 className="text-xl mb-4">
        Tabela de despesas e recebimentos
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-100">
            <tr>
              <th className="text-left p-3">Descrição</th>
              <th className="text-left p-3">Categoria</th>
              <th className="text-left p-3">Valor</th>
              <th className="text-left p-3">Data</th>
              <th className="text-left p-3">Ações</th>
            </tr>
          </thead>

          <tbody>
            {loading && items.length === 0 && (
              <tr>
                <td className="p-3 text-zinc-500" colSpan={5}>
                  Carregando...
                </td>
              </tr>
            )}

            {!loading && items.length === 0 && (
              <tr>
                <td className="p-3 text-zinc-500" colSpan={5}>
                  Nenhum lançamento para este período.
                </td>
              </tr>
            )}

            {items.map((expense) => (
              <tr key={expense.id} className="border-t">
                <td className="p-3">{expense.description}</td>
                <td className="p-3">{expense.category}</td>

                <td
                  className={`p-3 font-medium ${
                    expense.type === "expense"
                      ? "text-red-500"
                      : "text-emerald-600"
                  }`}
                >
                  {expense.type === "expense" ? "-" : "+"} R${" "}
                  {(expense.amountCents / 100).toFixed(2)}
                </td>

                <td className="p-3">
                  {new Date(expense.paidAt).toLocaleDateString("pt-BR")}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => onDelete(expense.id)}
                    disabled={deletingId === expense.id}
                    className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                  >
                    {deletingId === expense.id ? "Apagando..." : "Apagar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
