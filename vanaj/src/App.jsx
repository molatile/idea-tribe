import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dance" element={<div className="pt-24 text-center text-fluid-h2">Dance Page Coming Soon</div>} />
          <Route path="/languages" element={<div className="pt-24 text-center text-fluid-h2">Languages Page Coming Soon</div>} />
          <Route path="/food" element={<div className="pt-24 text-center text-fluid-h2">Food Page Coming Soon</div>} />
          <Route path="/marketplace" element={<div className="pt-24 text-center text-fluid-h2">Marketplace Coming Soon</div>} />
          <Route path="/tourism" element={<div className="pt-24 text-center text-fluid-h2">Tourism Page Coming Soon</div>} />
          <Route path="/archive" element={<div className="pt-24 text-center text-fluid-h2">Archive Coming Soon</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
