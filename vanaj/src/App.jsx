import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Dance from './pages/Dance';
import Languages from './pages/Languages';
import Tourism from './pages/Tourism';
import Food from './pages/Food';
import Marketplace from './pages/Marketplace';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dance" element={<Dance />} />
          <Route path="/languages" element={<Languages />} />
          <Route path="/food" element={<Food />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/tourism" element={<Tourism />} />
          <Route path="/archive" element={<div className="pt-24 text-center text-fluid-h2">Archive Coming Soon</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
