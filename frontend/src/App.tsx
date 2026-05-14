import { BurnAidProvider } from './context/BurnAidContext';
import { BurnAidShell } from './components/layout/BurnAidShell';

/**
 * Application entry: provides global client state, then renders the main layout + routed views.
 */
export default function App() {
  return (
    <BurnAidProvider>
      <BurnAidShell />
    </BurnAidProvider>
  );
}
