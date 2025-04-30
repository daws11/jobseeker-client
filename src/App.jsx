import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Applicants from './pages/Applicants';
import Vacancies from './pages/Vacancies';

function App() {
  return (
    <Router>
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/applicants" element={<Applicants />} />
        </Route>
        </Routes>
    </Router>
  );
}

export default App;
