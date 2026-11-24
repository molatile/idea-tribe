import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Dance from './pages/Dance';
import Languages from './pages/Languages';
import Tourism from './pages/Tourism';
import Food from './pages/Food';
import Marketplace from './pages/Marketplace';
import ErrorBoundary from './components/shared/ErrorBoundary';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ErrorBoundary pageName="Home"><Home /></ErrorBoundary>} />
          <Route path="/dance" element={<ErrorBoundary pageName="Dance"><Dance /></ErrorBoundary>} />
          <Route path="/languages" element={<ErrorBoundary pageName="Languages & Map"><Languages /></ErrorBoundary>} />
          <Route path="/food" element={<ErrorBoundary pageName="Food & Cuisine"><Food /></ErrorBoundary>} />
          <Route path="/marketplace" element={<ErrorBoundary pageName="Marketplace"><Marketplace /></ErrorBoundary>} />
          <Route path="/tourism" element={<ErrorBoundary pageName="Tourism"><Tourism /></ErrorBoundary>} />
          <Route path="/archive" element={<ErrorBoundary pageName="Archive"><div className="pt-24 text-center text-fluid-h2">Archive Coming Soon</div></ErrorBoundary>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
