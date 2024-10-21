"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaInfoCircle, FaQuestionCircle, FaTags, FaWrench } from 'react-icons/fa';

const Footer = () => {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isToolModalOpen, setToolModalOpen] = useState(false);

  const navigateTo = (path) => {
    router.push(path);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openToolModal = () => {
    setToolModalOpen(true);
  };

  const closeToolModal = () => {
    setToolModalOpen(false);
  };

  return (
    <>
      <footer className="dashboard-color text-white w-full py-6 border-t-2 border-[#2C2D33] px-10 ">
        <div className="w-full flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Footer Text */}
          <span className="text-white text-sm md:text-base">
            &copy; 2024 Seven Point Labs
          </span>

          {/* Footer Links */}
          <div className="flex space-x-8">
            <button
              onClick={() => navigateTo('/about')}
              className="flex items-center text-white hover:text-[#A9DFD8] transition duration-300 focus:outline-none"
            >
              <FaInfoCircle className="mr-2" /> About
            </button>
            <button
              onClick={() => navigateTo('/faq')}
              className="flex items-center text-white hover:text-[#A9DFD8] transition duration-300 focus:outline-none"
            >
              <FaQuestionCircle className="mr-2" /> FAQ
            </button>
            <button
              onClick={openModal}
              className="flex items-center text-white hover:text-[#A9DFD8] transition duration-300 focus:outline-none"
            >
              <FaTags className="mr-2" /> NTEE Code Suggestion
            </button>
            <button
              onClick={openToolModal}
              className="flex items-center text-white hover:text-[#A9DFD8] transition duration-300 focus:outline-none"
            >
              <FaWrench className="mr-2" /> Tool Suggestion
            </button>
          </div>
        </div>
      </footer>

      {/* Modal for NTEE Code Suggestion */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#21222D] w-full max-w-lg p-8 rounded-md shadow-lg relative text-white">
            <h2 className="text-2xl font-bold mb-4">NTEE Code Suggestion</h2>

            <form action="mailto:recs@nonprofitly.co" method="post" encType="text/plain" className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Your Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full mt-1 px-3 py-2 bg-[#171821] border-b-4 text-white rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Organization</label>
                <input
                  type="text"
                  name="organization"
                  className="w-full mt-1 px-3 py-2 bg-[#171821] border-b-4 text-white rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="w-full mt-1 px-3 py-2 bg-[#171821] border-b-4 text-white rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Brief Description of the Correct or New NTEE Code</label>
                <textarea
                  name="description"
                  rows="4"
                  className="w-full mt-1 px-3 py-2 bg-[#171821] border-b-4 text-white rounded-md"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#A9DFD8] text-black font-semibold px-4 py-2 rounded-md hover:bg-[#88B3AE] transition duration-200"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Tool Suggestion */}
      {isToolModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#21222D] w-full max-w-lg p-8 rounded-md shadow-lg relative text-white">
            <h2 className="text-2xl font-bold mb-4">Tool Suggestion</h2>

            <form action="mailto:recs@nonprofitly.co" method="post" encType="text/plain" className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Your Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full mt-1 px-3 py-2 bg-[#171821] border-b-4 text-white rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Organization</label>
                <input
                  type="text"
                  name="organization"
                  className="w-full mt-1 px-3 py-2 bg-[#171821] border-b-4 text-white rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="w-full mt-1 px-3 py-2 bg-[#171821] border-b-4 text-white rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Brief Description of the Digital Tool, Purpose, and Problem It Solves</label>
                <textarea
                  name="description"
                  rows="4"
                  className="w-full mt-1 px-3 py-2 bg-[#171821] border-b-4 text-white rounded-md"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeToolModal}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#A9DFD8] text-black font-semibold px-4 py-2 rounded-md hover:bg-[#88B3AE] transition duration-200"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
