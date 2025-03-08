import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import HeroContent from "./HeroContent";
import HeroMedia from "./HeroMedia";

export default function HeroContainer() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
      animate={inView ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden text-white"
    >
      {/* CRAZY ANIMATED BACKGROUND */}
      <div className="absolute inset-0  opacity-40 animate-pulse"></div>
      <div className="absolute inset-0 bg-noise opacity-10"></div>

      {/* FLOATING PARTICLES */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        <div className="absolute w-4 h-4 bg-white rounded-full top-1/3 left-1/4 opacity-50 blur-sm animate-float"></div>
        <div className="absolute w-3 h-3 bg-pink-500 rounded-full bottom-1/4 right-1/3 opacity-60 blur-md animate-float-rev"></div>
      </motion.div>

      {/* MAIN HERO CONTAINER */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-24 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* GLITCH EFFECT ON TEXT */}
          <div className="relative">
            <HeroContent />
            <div className="absolute top-0 left-0 w-full h-full mix-blend-difference opacity-50 animate-glitch"></div>
          </div>

          {/* CRAZY MEDIA SECTION */}
          <motion.div
            whileHover={{ scale: 1.1, rotateZ: 5 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative"
          >
            <HeroMedia />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
