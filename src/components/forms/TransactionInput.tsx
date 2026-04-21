import { useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Plus, Minus, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useBudgetStore, CATEGORIES } from '@/store/useBudgetStore';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

// ─── Trava da Vergonha ─────────────────────────────────────────────────────────
// Estados do botão quando categoria = "Erro de Percurso" e valor > 10% do saldo
const SHAME_STATES = [
  'Confirmar Gasto',
  'Tem certeza?',
  'Ainda dá tempo de voltar atrás.',
] as const;

interface ShameButtonProps {
  onConfirm: () => void;
  isActive: boolean; // true = trava ativada
}

const ShameButton = ({ onConfirm, isActive }: ShameButtonProps) => {
  const [escapeCount, setEscapeCount] = useState(0);
  const controls = useAnimation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isFixed = escapeCount >= SHAME_STATES.length; // Estado 4: fixo, permite clicar

  const label = isFixed ? SHAME_STATES[SHAME_STATES.length - 1] : SHAME_STATES[escapeCount];

  const handlePointerEnter = () => {
    if (!isActive || isFixed) return;

    // Escapa para uma posição aleatória dentro do container
    const range = 180;
    const x = (Math.random() - 0.5) * range;
    const y = (Math.random() - 0.5) * range * 0.5;
    controls.start({ x, y, transition: { type: 'spring', stiffness: 400, damping: 20 } });
    setEscapeCount((c) => Math.min(c + 1, SHAME_STATES.length));
  };

  const handleClick = () => {
    if (!isActive || isFixed) {
      onConfirm();
      setEscapeCount(0);
      controls.start({ x: 0, y: 0 });
    }
  };

  const buttonVariant = isFixed
    ? 'danger'
    : escapeCount === 0
    ? 'primary'
    : escapeCount === 1
    ? 'ghost'
    : 'danger';

  return (
    <div className="relative flex justify-center" style={{ minHeight: 48 }}>
      <motion.div animate={controls} initial={{ x: 0, y: 0 }}>
        <Button
          ref={buttonRef}
          variant={buttonVariant}
          size="lg"
          onPointerEnter={handlePointerEnter}
          onClick={handleClick}
          className="w-48 select-none"
        >
          {label}
        </Button>
      </motion.div>
    </div>
  );
};

// ─── Formulário principal ─────────────────────────────────────────────────────

interface FormState {
  type: 'income' | 'expense';
  amount: string;
  category: Category;
  description: string;
}

const DEFAULT_FORM: FormState = {
  type: 'expense',
  amount: '',
  category: 'Taxa de Sobrevivência',
  description: '',
};

export const TransactionInput = () => {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [error, setError] = useState('');
  const addTransaction = useBudgetStore((s) => s.addTransaction);
  const getDailyBalance = useBudgetStore((s) => s.getDailyBalance);

  const dailyBalance = getDailyBalance();
  const parsedAmount = parseFloat(form.amount);

  const isShameActive =
    form.type === 'expense' &&
    form.category === 'Erro de Percurso' &&
    !isNaN(parsedAmount) &&
    parsedAmount > dailyBalance * 0.1;

  const handleSubmit = () => {
    if (!form.amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Insira um valor válido, chefe.');
      return;
    }
    if (!form.description.trim()) {
      setError('Dê um nome pra essa tragédia.');
      return;
    }
    setError('');
    addTransaction({
      type: form.type,
      amount: parsedAmount,
      category: form.category,
      description: form.description,
    });
    setForm(DEFAULT_FORM);
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 backdrop-blur-sm flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">
          Registrar Movimento
        </h2>
        {isShameActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 text-xs text-amber-400"
          >
            <AlertCircle className="w-3 h-3" />
            <span>Trava ativada</span>
          </motion.div>
        )}
      </div>

      {/* Tipo: Receita / Despesa */}
      <div className="flex rounded-xl overflow-hidden border border-zinc-700 p-0.5 gap-0.5 bg-zinc-950">
        {(['expense', 'income'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setForm((f) => ({ ...f, type: t }))}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200',
              form.type === t
                ? t === 'expense'
                  ? 'bg-red-900/70 text-red-300'
                  : 'bg-emerald-900/70 text-emerald-300'
                : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            {t === 'expense' ? (
              <>
                <Minus className="w-3 h-3" /> Despesa
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" /> Receita
              </>
            )}
          </button>
        ))}
      </div>

      {/* Valor */}
      <Input
        id="amount"
        label="Valor (R$)"
        type="number"
        min="0"
        step="0.01"
        placeholder="0,00"
        value={form.amount}
        onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
      />

      {/* Categoria */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          Categoria
        </label>
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
          className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-colors duration-200 appearance-none cursor-pointer"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-zinc-900">
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Descrição */}
      <Input
        id="description"
        label="Descrição"
        type="text"
        placeholder={
          form.category === 'Erro de Percurso'
            ? 'Explique essa barbeiragem...'
            : 'Como você vai justificar isso?'
        }
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
      />

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 text-center"
        >
          {error}
        </motion.p>
      )}

      {/* Botão — normal ou Trava da Vergonha */}
      {isShameActive ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-center text-amber-500/80 leading-relaxed">
            Isso é{' '}
            <span className="font-bold text-amber-400">
              {((parsedAmount / dailyBalance) * 100).toFixed(0)}%
            </span>{' '}
            do seu saldo diário. O botão não quer cooperar.
          </p>
          <ShameButton onConfirm={handleSubmit} isActive={isShameActive} />
        </div>
      ) : (
        <Button variant="primary" size="lg" onClick={handleSubmit} className="w-full">
          Confirmar Gasto
        </Button>
      )}
    </div>
  );
};
