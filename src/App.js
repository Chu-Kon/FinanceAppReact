import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LossesPage from './components/LossesPage/LossesPage';
import Header from './components/Header/Header';
import Statistics from './components/Statistics/Statistics';
import Profits from './components/ProfitPage/ProfitPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Statistics></Statistics>} />
          <Route path="/losses" element={<LossesPage></LossesPage>} />
          <Route path="/profits" element={<Profits></Profits>} />
        </Routes>
        <div id="modal-root"></div>
      </div>
    </Router>
  );
}

export default App;
