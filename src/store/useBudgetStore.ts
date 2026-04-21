import { create } from 'zustand';
import { Transaction, FilterState, Category } from '@/types';

// ─── helpers ──────────────────────────────────────────────────────────────────

function getRemainingWorkdays(): number {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  let count = 0;
  for (let d = new Date(today); d <= lastDay; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return Math.max(count, 1); // nunca dividir por zero
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── mock inicial ──────────────────────────────────────────────────────────────

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: generateId(),
    amount: 3500,
    type: 'income',
    category: 'Taxa de Sobrevivência',
    description: 'Salário (o que restou depois do imposto de existir)',
    date: new Date().toISOString(),
  },
  {
    id: generateId(),
    amount: 320,
    type: 'expense',
    category: 'Gasolina e Lágrimas',
    description: 'Combustível + choro existencial no trânsito',
    date: new Date().toISOString(),
  },
  {
    id: generateId(),
    amount: 89.9,
    type: 'expense',
    category: 'MasterChef Iludido',
    description: 'Ingredientes pro prato que virou omelete',
    date: new Date().toISOString(),
  },
];

// ─── types do store ────────────────────────────────────────────────────────────

interface BudgetStore {
  transactions: Transaction[];
  filters: FilterState;

  // selectors (computed inline)
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getGrossBalance: () => number;
  getDailyBalance: () => number;

  // actions
  addTransaction: (payload: Omit<Transaction, 'id' | 'date'>) => void;
  removeTransaction: (id: string) => void;
  setMonthlyReserve: (value: number) => void;
  setWeekendReserve: (value: number) => void;
  setEventReserve: (amount: number, date: string | null) => void;
}

// ─── store ─────────────────────────────────────────────────────────────────────

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  transactions: MOCK_TRANSACTIONS,
  filters: {
    monthlyReserve: 500,   // O Intocável
    weekendReserve: 200,   // A Glória
    eventReserve: { amount: 150, date: null }, // Atestado de Falência
  },

  // ── selectors ────────────────────────────────────────────────────────────────

  getTotalIncome: () =>
    get().transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0),

  getTotalExpenses: () =>
    get().transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0),

  getGrossBalance: () => get().getTotalIncome() - get().getTotalExpenses(),

  getDailyBalance: () => {
    const { filters } = get();
    const gross = get().getGrossBalance();
    const afterReserves =
      gross -
      filters.monthlyReserve -
      filters.weekendReserve -
      filters.eventReserve.amount;
    return afterReserves / getRemainingWorkdays();
  },

  // ── actions ───────────────────────────────────────────────────────────────────

  addTransaction: (payload) =>
    set((state) => ({
      transactions: [
        ...state.transactions,
        { ...payload, id: generateId(), date: new Date().toISOString() },
      ],
    })),

  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  setMonthlyReserve: (value) =>
    set((state) => ({
      filters: { ...state.filters, monthlyReserve: value },
    })),

  setWeekendReserve: (value) =>
    set((state) => ({
      filters: { ...state.filters, weekendReserve: value },
    })),

  setEventReserve: (amount, date) =>
    set((state) => ({
      filters: { ...state.filters, eventReserve: { amount, date } },
    })),
}));

// ─── seletor de categoria ──────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  'Projeto Mutante',
  'MasterChef Iludido',
  'Gasolina e Lágrimas',
  'Taxa de Sobrevivência',
  'Erro de Percurso',
];
