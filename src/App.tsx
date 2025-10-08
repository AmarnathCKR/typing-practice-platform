import ResultsScreen from "./components/ResultsScreen";
import SettingsPanel from "./components/SettingsPanel";
import StatsPanel from "./components/StatsPanel";
import TypingArea from "./components/TypingArea";

function App() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <ResultsScreen />
        <StatsPanel />
        <SettingsPanel />
        <TypingArea />
      </div>
    </div>
  );
}

export default App;
