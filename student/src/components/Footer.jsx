import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-4">SAT Scorer</h3>
            <p className="text-gray-400 text-base">
              Empowering students to achieve their academic dreams with personalized test prep and mentorship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  Courses
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  Tests
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Get in Touch</h3>
            <p className="text-gray-400 text-base mb-2">Email: support@satscorer.com</p>
            <p className="text-gray-400 text-base mb-4">Phone: +1 (555) 123-4567</p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full text-white hover:bg-indigo-600 transition-colors duration-200"
                aria-label="Twitter"
              >
                <span className="text-xl">𝕏</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full text-white hover:bg-indigo-600 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <span className="text-xl">in</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full text-white hover:bg-indigo-600 transition-colors duration-200"
                aria-label="Instagram"
              >
                <span className="text-xl">📸</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center">
          <p className="text-gray-400 text-base">
            &copy; 2025 SAT Scorer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;