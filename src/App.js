import { ModeProvider } from "./context/ModeContext";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <ModeProvider>
      <Dashboard />
    </ModeProvider>
  );
}
