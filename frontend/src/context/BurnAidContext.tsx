import { createContext, useContext, type ReactNode } from 'react';
import { useBurnAidController } from './useBurnAidController';

/** Full app API: state, refs, and handlers produced by useBurnAidController. */
export type BurnAidContextValue = ReturnType<typeof useBurnAidController>;

const BurnAidContext = createContext<BurnAidContextValue | null>(null);

/** Mount once at the app root; all screens consume state via useBurnAid(). */
export function BurnAidProvider({ children }: { children: ReactNode }) {
  const value = useBurnAidController();
  return <BurnAidContext.Provider value={value}>{children}</BurnAidContext.Provider>;
}

export function useBurnAid(): BurnAidContextValue {
  const ctx = useContext(BurnAidContext);
  if (!ctx) throw new Error('useBurnAid must be used inside BurnAidProvider');
  return ctx;
}
