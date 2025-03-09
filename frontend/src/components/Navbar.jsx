import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = () => {
      try {
        const data = JSON.parse(localStorage.getItem("user"));
        setUser(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  const menuItems = ["Study", "Community", "Journal", "Resume", "Calendar"];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed w-full bg-white shadow-lg z-50"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Brand Name */}
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold gradient-text cursor-pointer"
            onClick={() => navigate("/")}
          >
            Vidyarthi
          </motion.h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <motion.a
                key={item}
                whileHover={{ scale: 1.1 }}
                className="text-gray-700 hover:text-purple transition-colors"
                href={`/${item.toLowerCase()}`}
              >
                {item}
              </motion.a>
            ))}
            {/* Login/Register Button */}
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 bg-purple text-white rounded-lg shadow-md hover:bg-purple/80 transition"
                onClick={() => navigate("/profile")}
              >
                Profile
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 bg-purple text-white rounded-lg shadow-md hover:bg-purple/80 transition"
                onClick={() => navigate("/login")}
              >
                Login / Register
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-md"
          >
            {menuItems.map((item) => (
              <a
                key={item}
                className="block px-6 py-3 text-gray-700 hover:bg-purple hover:text-white transition"
                href={`#${item.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            ))}
            {/* Mobile Login/Register or Profile Button */}
            {user ? (
              <button
                className="block w-full px-6 py-3 bg-purple text-white text-center hover:bg-purple/80 transition"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/profile");
                }}
              >
                Profile
              </button>
            ) : (
              <button
                className="block w-full px-6 py-3 bg-purple text-white text-center hover:bg-purple/80 transition"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/login");
                }}
              >
                Login / Register
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
