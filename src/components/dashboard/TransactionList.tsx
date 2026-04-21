import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { formatCurrency } from '@/lib/utils';
import { Transaction } from '@/types';

const CATEGORY_EMOJI: Record<string, string> = {
  'Projeto Mutante': '🧬',
  'MasterChef Iludido': '👨‍🍳',
  'Gasolina e Lágrimas': '⛽',
  'Taxa de Sobrevivência': '💼',
  'Erro de Percurso': '💸',
};

const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
  const removeTransaction = useBudgetStore((s) => s.removeTransaction);
  const isIncome = transaction.type === 'income';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16, height: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-3 py-3 px-1 border-b border-zinc-800/50 last:border-0 group"
    >
      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-base shrink-0">
        {CATEGORY_EMOJI[transaction.category] ?? '💰'}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-200 truncate">{transaction.description}</p>
        <p className="text-xs text-zinc-600 truncate">{transaction.category}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1">
          {isIncome ? (
            <TrendingUp className="w-3 h-3 text-emerald-500" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-500" />
          )}
          <span
            className={`text-sm font-bold ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </span>
        </div>

        <button
          onClick={() => removeTransaction(transaction.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-900/40 text-zinc-600 hover:text-red-400"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};

export const TransactionList = () => {
  const transactions = useBudgetStore((s) => s.transactions);

  if (transactions.length === 0) {
    return (
      <div className="w-full max-w-md rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 text-center">
        <p className="text-sm text-zinc-600">Nenhuma transação. Aproveite enquanto dura.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
          Histórico de Tragédias
        </h3>
      </div>
      <div className="px-4">
        <AnimatePresence mode="popLayout">
          {[...transactions].reverse().map((t) => (
            <TransactionRow key={t.id} transaction={t} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
