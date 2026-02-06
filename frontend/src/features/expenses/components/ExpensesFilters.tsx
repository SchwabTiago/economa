import { Card } from "../../../shared/ui/Card";
import { Select } from "../../../shared/ui/Select";

type Props = {
  month: number;
  year: number;
  totalCents: number;
  onMonthChange: (m: number) => void;
  onYearChange: (y: number) => void;
};

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function ExpensesFilters({
  month,
  year,
  totalCents,
  onMonthChange,
  onYearChange,
}: Props) {
  return (
    <aside className="col-span-3 h-fit">
      <Card>
        <h2 className="text-lg mb-4">Filtros</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-zinc-600">Mês</label>
            <Select
              value={month}
              onChange={(e) => onMonthChange(Number(e.target.value))}
            >
              {months.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-sm text-zinc-600">Ano</label>
            <Select
              value={year}
              onChange={(e) => onYearChange(Number(e.target.value))}
            >
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </Select>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-zinc-500">Total do mês</p>
            <p
              className={`text-2xl font-bold ${
                totalCents > 0
                  ? "text-emerald-600"
                  : totalCents < 0
                    ? "text-red-500"
                    : "text-black"
              }`}
            >
              R$ {(totalCents / 100).toFixed(2)}
            </p>
          </div>
        </div>
      </Card>
    </aside>
  );
}
