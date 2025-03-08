import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiTarget, FiTrendingUp, FiUsers } from "react-icons/fi";

export default function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { icon: FiUsers, value: "10K+", label: "Active Students" },
    { icon: FiTarget, value: "95%", label: "Success Rate" },
    { icon: FiTrendingUp, value: "24/7", label: "Learning Support" },
  ];

  return (
    <section ref={ref} id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            About Vidyarthi
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing education through technology, making learning
            more accessible, engaging, and effective for students worldwide.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-mint via-purple to-coral rounded-2xl blur-3xl opacity-20" />
              <div className="relative bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-600 mb-6">
                  To empower students with innovative learning tools and create
                  an ecosystem where education meets technology, fostering a
                  community of lifelong learners.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="w-12 h-12 mx-auto mb-2 bg-purple/10 rounded-full flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-purple" />
                      </div>
                      <div className="font-bold text-2xl text-gray-800">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r border-2 from-mint/10 via-purple/10 to-coral/10 p-6 rounded-2xl">
              <h4 className="text-xl font-semibold mb-2">
                Personalized Learning
              </h4>
              <p className="text-gray-600">
                AI-powered learning paths adapted to your unique needs and
                learning style.
              </p>
            </div>
            <div className="bg-gradient-to-r border-2 from-coral/10 via-purple/10 to-mint/10 p-6 rounded-2xl">
              <h4 className="text-xl font-semibold mb-2">Expert Support</h4>
              <p className="text-gray-600">
                Access to experienced mentors and a supportive community of
                learners.
              </p>
            </div>
            <div className="bg-gradient-to-r border-2 from-purple/10 via-mint/10 to-coral/10 p-6 rounded-2xl">
              <h4 className="text-xl font-semibold mb-2">
                Interactive Learning
              </h4>
              <p className="text-gray-600">
                Engaging content and real-time collaboration tools for better
                understanding.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
