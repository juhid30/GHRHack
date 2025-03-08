import { motion } from "framer-motion";

export default function HeroMedia() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative z-10"
    >
      <div className="relative">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-r from-mint via-purple to-coral rounded-full blur-3xl opacity-30"
        />
        <div className="relative bg-white rounded-2xl shadow-xl p-4 backdrop-blur-sm bg-white/80">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
            alt="Students collaborating"
            className="w-full h-auto rounded-xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-lg p-4 flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-mint/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-mint"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Quick Start</p>
              <p className="text-sm text-gray-500">Join 10k+ students</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
