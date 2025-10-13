import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Portfolio from './pages/Portfolio';
import PhotoShowcase from './pages/PhotoShowcase';
import AboutMe from './pages/AboutMe';
import NotFound from './pages/NotFound';
import { useFaviconAnimation } from './utils/useFaviconAnimation';
import './App.css';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={<Navigate to="/portfolio" replace />}
        />
        <Route
          path="/portfolio"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              <Portfolio />
            </motion.div>
          }
        />
        <Route
          path="/photos"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              <PhotoShowcase />
            </motion.div>
          }
        />
        <Route
          path="/about"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              <AboutMe />
            </motion.div>
          }
        />
        <Route
          path="*"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
            >
              <NotFound />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  // Animate the favicon
  useFaviconAnimation();

  return (
    <Router>
      <div className="App">
        <Navbar />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
