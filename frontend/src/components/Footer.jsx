import React from "react";
import { FiMenu, FiX, FiBook, FiUsers, FiAward, FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="text-purple py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-purple mb-4">Vidyarthi</h3>
          <p className="text-gray-400">
            Empowering students to achieve their academic dreams through
            innovative learning solutions.
          </p>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {["Home", "Features", "About", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-400 hover:text-mint transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4">Connect With Us</h4>
          <div className="flex space-x-4">
            <FiMail className="w-6 h-6 text-gray-400 hover:text-mint cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Vidyarthi. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
