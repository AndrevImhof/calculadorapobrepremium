export type Category =
  | 'Projeto Mutante'
  | 'MasterChef Iludido'
  | 'Gasolina e Lágrimas'
  | 'Taxa de Sobrevivência'
  | 'Erro de Percurso';

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: Category;
  description: string;
  date: string;
}

export interface FilterState {
  monthlyReserve: number; // O Intocável
  weekendReserve: number; // A Glória
  eventReserve: { amount: number; date: string | null }; // Atestado de Falência
}
