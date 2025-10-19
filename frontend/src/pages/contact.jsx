import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Message Sent Securely!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-gray-200 px-6 py-12">
      {/* Navigation Links */}
      <div className="text-sm text-gray-400 pb-6 w-full max-w-5xl">
        <Link to="/" className="hover:underline uppercase hover:font-semibold">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="uppercase font-bold text-red-400">Contact</span>
      </div>

      {/* Page Title with Cyber Glow */}
      <motion.h1
        className="text-5xl font-extrabold text-neon-green glitch mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Contact CyberSec Support
      </motion.h1>
      <p className="text-gray-400 text-lg">
        Your security is our priority. Get in touch with our team.
      </p>

      {/* Contact Form */}
      <motion.div
        className="w-full max-w-2xl bg-[#121212] p-8 mt-8 rounded-lg shadow-lg border border-gray-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* Name Input */}
          <label className="text-gray-300">
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 bg-black text-gray-100 border border-gray-700 rounded-md focus:ring-2 focus:ring-neon-green focus:outline-none transition-all"
            />
          </label>

          {/* Email Input */}
          <label className="text-gray-300">
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 bg-black text-gray-100 border border-gray-700 rounded-md focus:ring-2 focus:ring-neon-green focus:outline-none transition-all"
            />
          </label>

          {/* Message Input */}
          <label className="text-gray-300">
            Message:
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="mt-1 w-full p-3 bg-black text-gray-100 border border-gray-700 rounded-md focus:ring-2 focus:ring-neon-green focus:outline-none transition-all"
            ></textarea>
          </label>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full py-3 mt-4 bg-neon-green text-white border font-semibold text-lg rounded-md hover:bg-green-600 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send Secure Message
          </motion.button>
        </form>
      </motion.div>

      {/* Contact Info & Support */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-gray-400 text-lg">
          <span className="font-bold text-neon-green">📍 Headquarters:</span>{" "}
          CyberSec Labs, Secure Location
        </p>
        <p className="text-gray-400 text-lg">
          <span className="font-bold text-neon-green">📧 Email:</span>{" "}
          support@cybersec.com
        </p>
        <p className="text-gray-400 text-lg">
          <span className="font-bold text-neon-green">⏳ Support Hours:</span>{" "}
          24/7 Active Monitoring
        </p>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        className="mt-12 max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-neon-green mb-4">
          Frequently Asked Questions
        </h2>
        <div className="bg-[#121212] p-6 rounded-lg border border-gray-700">
          <p className="text-lg">
            <span className="font-bold text-gray-200">
              🔹 How long does it take to get a response?
            </span>
            <br />
            Our team responds within 24 hours, but critical security issues are
            prioritized.
          </p>
          <hr className="border-gray-700 my-4" />
          <p className="text-lg">
            <span className="font-bold text-gray-200">
              🔹 Can I report security vulnerabilities?
            </span>
            <br />
            Yes! Please use this contact form or our
            <Link to="#" className="text-blue-400 hover:underline">
              Bug Bounty Program
            </Link>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
