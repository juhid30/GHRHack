import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
// import { FiMenu, FiX, FiBook, FiUsers, FiAward, FiMail } from "react-icons/fi";

import HeroContainer from "../components/Hero/HeroContainer";
import Features from "../components/Features";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import LoadingScreen from "../components/LoadingScreen";
import AboutSection from "../components/AboutSection";

const LandingPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <Navbar />
        <main>
          <HeroContainer />
          <Features />
          <AboutSection />
          <ContactUs />
        </main>
        <Footer />
      </motion.div>
    </>
  );
};

export default LandingPage;
