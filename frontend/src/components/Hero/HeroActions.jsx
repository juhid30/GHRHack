import { motion } from "framer-motion";

export default function HeroActions() {
  return (
    <div className="flex flex-wrap gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-4 bg-purple text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        Get Started
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-4 border-2 border-purple text-purple rounded-full font-semibold hover:bg-purple/5 transition-colors duration-300"
      >
        Learn More
      </motion.button>
    </div>
  );
}
