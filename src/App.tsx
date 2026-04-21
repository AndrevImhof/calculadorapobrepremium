import { useState } from 'react';
import { motion } from 'framer-motion';
import { SaldoDisplay } from '@/components/dashboard/SaldoDisplay';
import { ReservePanel } from '@/components/dashboard/ReservePanel';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { TransactionInput } from '@/components/forms/TransactionInput';
import { LayoutDashboard, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'dashboard' | 'add';

function App() {
  const [tab, setTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-sm font-black tracking-tight bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
              Calculadora de Role
            </h1>
            <p className="text-xs text-zinc-600">para pobres que gostam de viver</p>
          </div>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-700 shadow-lg shadow-amber-900/40" />
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-lg mx-auto flex flex-col items-center gap-6">
          {tab === 'dashboard' ? (
            <>
              <SaldoDisplay />
              <ReservePanel />
              <TransactionList />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <TransactionInput />
            </motion.div>
          )}
        </div>
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-900 px-6 py-3 safe-area-inset-bottom">
        <div className="max-w-lg mx-auto flex justify-around">
          {([
            { id: 'dashboard', icon: LayoutDashboard, label: 'Painel' },
            { id: 'add', icon: PlusCircle, label: 'Registrar' },
          ] as const).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                'flex flex-col items-center gap-1 px-6 py-1 rounded-xl transition-all duration-200',
                tab === id ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-400'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;
