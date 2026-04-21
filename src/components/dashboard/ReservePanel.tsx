import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, CalendarClock, ChevronDown } from 'lucide-react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';

export const ReservePanel = () => {
  const [open, setOpen] = useState(false);
  const filters = useBudgetStore((s) => s.filters);
  const setMonthlyReserve = useBudgetStore((s) => s.setMonthlyReserve);
  const setWeekendReserve = useBudgetStore((s) => s.setWeekendReserve);
  const setEventReserve = useBudgetStore((s) => s.setEventReserve);

  const totalReserved =
    filters.monthlyReserve + filters.weekendReserve + filters.eventReserve.amount;

  return (
    <div className="w-full max-w-md rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold text-zinc-300">Reservas Sagradas</span>
          <span className="ml-1 text-xs text-zinc-500">
            ({formatCurrency(totalReserved)} intocáveis)
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 flex flex-col gap-4 border-t border-zinc-800 pt-4">
              {/* O Intocável */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-amber-500" />
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    O Intocável
                  </label>
                </div>
                <Input
                  type="number"
                  min="0"
                  step="10"
                  value={filters.monthlyReserve}
                  onChange={(e) => setMonthlyReserve(parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-zinc-600">Reserva mensal — nem pensa.</p>
              </div>

              {/* A Glória */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-yellow-500" />
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    A Glória
                  </label>
                </div>
                <Input
                  type="number"
                  min="0"
                  step="10"
                  value={filters.weekendReserve}
                  onChange={(e) => setWeekendReserve(parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-zinc-600">Pro fim de semana que você merece (ou acha que merece).</p>
              </div>

              {/* Atestado de Falência */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <CalendarClock className="w-3 h-3 text-red-500" />
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Atestado de Falência
                  </label>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="10"
                    placeholder="Valor"
                    value={filters.eventReserve.amount}
                    onChange={(e) =>
                      setEventReserve(parseFloat(e.target.value) || 0, filters.eventReserve.date)
                    }
                  />
                  <Input
                    type="date"
                    value={filters.eventReserve.date ?? ''}
                    onChange={(e) =>
                      setEventReserve(filters.eventReserve.amount, e.target.value || null)
                    }
                    className="w-40"
                  />
                </div>
                <p className="text-xs text-zinc-600">Aquele evento caro que você comprometeu o mês todo.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
