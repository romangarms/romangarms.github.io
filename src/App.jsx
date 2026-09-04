import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Acceleration from './pages/Acceleration';
import LeaderboardWA from './pages/LeaderboardWA';
import LeaderboardCA from './pages/LeaderboardCA';
import NotFound from './pages/NotFound';

const MotionDiv = motion.div;

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' } },
};

function Page({ children }) {
  return (
    <MotionDiv initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      {children}
    </MotionDiv>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/acceleration" replace />} />
        <Route path="/acceleration" element={<Page><Acceleration /></Page>} />
        <Route path="/leaderboard" element={<Page><LeaderboardWA /></Page>} />
        <Route path="/leaderboard-ca" element={<Page><LeaderboardCA /></Page>} />
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <Navbar />
        <main>
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}
