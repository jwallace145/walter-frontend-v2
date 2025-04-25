import { PortfolioStock } from '@/lib/models/PortfolioStock';

export interface Portfolio {
  total_equity: number;
  stocks: PortfolioStock[];
}
