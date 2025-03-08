import { motion } from "framer-motion";
import HeroActions from "./HeroActions";

export default function HeroContent() {
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10"
    >
      {/* <motion.span
        variants={itemVariants}
        className="inline-block px-4 py-2 rounded-full bg-mint/10 text-mint font-medium text-sm mb-6"
      >
        Welcome to Vidyarthi
      </motion.span> */}

      <motion.h1
        variants={itemVariants}
        className="text-5xl md:text-[4rem] font-bold mb-6 gradient-text leading-tight"
      >
        Transform Your
        <br />
        Learning Journey
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-xl text-gray-600 mb-8 max-w-lg"
      >
        Unlock your academic potential with personalized learning paths,
        collaborative study groups, and AI-powered tools designed for modern
        students.
      </motion.p>

      <HeroActions />
    </motion.div>
  );
}
