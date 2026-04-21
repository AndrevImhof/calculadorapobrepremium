import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp, AlertTriangle, Wallet } from 'lucide-react';
import { GlareCard } from './GlareCard';
import { useBudgetStore } from '@/store/useBudgetStore';
import { formatCurrency } from '@/lib/utils';

export const SaldoDisplay = () => {
  const getDailyBalance = useBudgetStore((s) => s.getDailyBalance);
  const getGrossBalance = useBudgetStore((s) => s.getGrossBalance);
  const getTotalIncome = useBudgetStore((s) => s.getTotalIncome);
  const getTotalExpenses = useBudgetStore((s) => s.getTotalExpenses);

  const dailyBalance = getDailyBalance();
  const grossBalance = getGrossBalance();
  const income = getTotalIncome();
  const expenses = getTotalExpenses();
  const isNegative = dailyBalance < 0;

  return (
    <div className="flex flex-col items-center gap-6">
      <GlareCard isNegative={isNegative}>
        <div className="flex flex-col h-full p-7 gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                Calculadora de Role
              </span>
            </div>
            <motion.div
              animate={isNegative ? { rotate: [0, -5, 5, -5, 0] } : {}}
              transition={{ duration: 0.5, repeat: isNegative ? Infinity : 0, repeatDelay: 2 }}
            >
              {isNegative ? (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 shadow-lg shadow-amber-900/50" />
              )}
            </motion.div>
          </div>

          {/* Saldo do Dia */}
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-xs text-zinc-500 uppercase tracking-widest">
              Saldo do Dia
            </span>
            <motion.div
              key={dailyBalance}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span
                className={`text-4xl font-black tracking-tight ${
                  isNegative
                    ? 'text-red-400'
                    : 'bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent'
                }`}
              >
                {formatCurrency(dailyBalance)}
              </span>
            </motion.div>
            <span className="text-xs text-zinc-600">por dia útil restante</span>
          </div>

          {/* Divider */}
          <div className={`h-px ${isNegative ? 'bg-red-900/40' : 'bg-amber-900/30'}`} />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-xs text-zinc-500">Entradas</span>
              </div>
              <span className="text-sm font-bold text-emerald-400">{formatCurrency(income)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <TrendingDown className="w-3 h-3 text-red-500" />
                <span className="text-xs text-zinc-500">Saídas</span>
              </div>
              <span className="text-sm font-bold text-red-400">{formatCurrency(expenses)}</span>
            </div>
          </div>

          {/* Saldo Bruto */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-800/50">
            <span className="text-xs text-zinc-600">Saldo Bruto</span>
            <span
              className={`text-sm font-bold ${
                grossBalance >= 0 ? 'text-zinc-300' : 'text-red-400'
              }`}
            >
              {formatCurrency(grossBalance)}
            </span>
          </div>
        </div>
      </GlareCard>

      {/* Alerta de vergonha financeira */}
      <AnimatePresence>
        {isNegative && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
            className="max-w-[340px] rounded-2xl border border-red-900/60 bg-red-950/40 p-4 backdrop-blur-sm"
          >
            <div className="flex gap-3 items-start">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-300 leading-relaxed">
                Parabéns. Você acabou de roubar dinheiro do seu{' '}
                <span className="font-bold text-red-200">'eu' de sexta-feira</span>. Ele manda
                lembranças e disse que te odeia.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
