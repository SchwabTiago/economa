import { useState } from "react";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";
import { Input } from "../../../shared/ui/Input";
import type { Expense, TransactionType } from "../models/expense";

type Props = {
  onSubmit: (expense: Omit<Expense, "id">) => void;
};

export function ExpenseForm({ onSubmit }: Props) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;

    const type = submitter.value as TransactionType;

    onSubmit({
      description,
      category,
      paidAt: date,
      amountCents: Math.round(Number(amount) * 100),
      type,
    });

    setDescription("");
    setCategory("");
    setAmount("");
    setDate("");
  }

  return (
    <Card>
      <h3 className="text-xl mb-4">Cadastrar lançamento</h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Input
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Input
          type="number"
          step="0.01"
          placeholder="Valor"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="col-span-2 flex justify-center gap-4 pt-2">
          <Button
            type="submit"
            value="expense"
            className="bg-red-600 text-white hover:bg-red-500"
          >
            Cadastrar despesa
          </Button>

          <Button
            type="submit"
            value="income"
            className="bg-emerald-600 text-white hover:bg-emerald-500"
          >
            Cadastrar recebimento
          </Button>
        </div>
      </form>
    </Card>
  );
}
