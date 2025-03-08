import React from "react";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiBook, FiUsers, FiAward, FiMail } from "react-icons/fi";

const Features = () => {
  const features = [
    {
      icon: FiBook,
      title: "Smart Learning",
      description: "AI-powered study tools tailored to your needs",
    },
    {
      icon: FiUsers,
      title: "Study Groups",
      description: "Connect with peers who share your academic interests",
    },
    {
      icon: FiAward,
      title: "Achievement System",
      description: "Earn rewards as you progress in your studies",
    },
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      id="features"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl font-bold text-center mb-12 gradient-text"
        >
          Features that Make Learning Fun
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 }}
              className="p-6 rounded-xl bg-gradient-to-br from-mint/5 via-purple/5 to-coral/5 hover:shadow-xl transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-purple mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
