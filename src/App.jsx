import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Introduction from './pages/Introduction';
import Globe from './components/Globe';
import CountryList from './components/CountryList';
import CountryDetails from './components/CountryDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Introduction />} />
        <Route path="/globe" element={<Globe />} />
        <Route path="/countries" element={<CountryList />} />
        <Route path="/country/:countryCode" element={<CountryDetails />} />
      </Routes>
    </Router>
  );
}

export default App;