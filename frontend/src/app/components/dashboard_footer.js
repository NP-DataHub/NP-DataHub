"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaInfoCircle, FaQuestionCircle, FaTags, FaWrench, FaCheckCircle } from 'react-icons/fa';
import { IoMdGrid } from "react-icons/io";
import emailjs from 'emailjs-com';

const Footer = ({isDarkMode}) => {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isToolModalOpen, setToolModalOpen] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
    
  const navigateTo = (path) => {
    router.push(path);
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const openToolModal = () => setToolModalOpen(true);
  const closeToolModal = () => setToolModalOpen(false);

  const sendEmail = (e, templateId) => {
    e.preventDefault();
    emailjs
      .sendForm('service_9buauy9', templateId, e.target, 'm66VYLm_g93hibrW8')
      .then((result) => {
        setSuccess(true);
        e.target.reset(); // Reset form after submission
        setTimeout(() => {
          setSuccess(false);
          isModalOpen ? closeModal() : closeToolModal();
        }, 2000); // Success message for 2 seconds, then close modal
      })
      .catch((error) => console.error('Error sending email:', error.text));
  };

  return (
    <>
      <footer className= {`${isDarkMode ? "dashboard-color text-white  border-t-2 border-[#2C2D33]" : "bg-white text-black border-t-2 border-gray-200"} w-full py-4 md:py-6 px-4 md:px-10`}>
        <div className="w-full flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <span className="text-xs md:text-sm lg:text-base transition-colors duration-300 ">
            &copy; 2025 Seven Point Labs
          </span>

          <div className="flex flex-wrap justify-center space-x-4 md:space-x-8">
            <button
              onClick={() => navigateTo('/about')}
              className="flex items-center text-xs md:text-sm lg:text-base hover:text-[#A9DFD8] transition duration-300 focus:outline-none"
            >
              <FaInfoCircle className="mr-1 md:mr-2" /> About
            </button>
            <button
              onClick={() => navigateTo('/faq')}
              className="flex items-center text-xs md:text-sm lg:text-base hover:text-[#A9DFD8] transition duration-300 focus:outline-none"
            >
              <FaQuestionCircle className="mr-1 md:mr-2" /> FAQ
            </button>
            <button
              onClick={() => navigateTo('/ntee')}
              className="flex items-center text-xs md:text-sm lg:text-base hover:text-[#A9DFD8] transition duration-300 focus:outline-none"
            >
              <IoMdGrid className="mr-1 md:mr-2" /> NTEE 
            </button>
            <button
              onClick={openModal}
              className="flex items-center text-xs md:text-sm lg:text-base hover:text-[#A9DFD8] transition duration-300 focus:outline-none"
            >
              <FaTags className="mr-1 md:mr-2" /> NTEE Code Suggestion
            </button>
            <button
              onClick={openToolModal}
              className="flex items-center text-xs md:text-sm lg:text-base hover:text-[#A9DFD8] transition duration-300 focus:outline-none"
            >
              <FaWrench className="mr-1 md:mr-2" /> Tool Suggestion
            </button>
          </div>
        </div>
      </footer>

      {/* Success Notification */}
      {isSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#21222D] p-4 md:p-6 rounded-md shadow-lg text-white text-center">
            <FaCheckCircle className="text-green-500 text-3xl md:text-4xl mb-2 md:mb-4" />
            <p className="text-sm md:text-lg font-semibold">Email sent successfully!</p>
          </div>
        </div>
      )}

      {/* Modal for NTEE Code Suggestion */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-[#21222D] w-full max-w-md md:max-w-lg p-6 md:p-8 rounded-md shadow-lg relative text-white">
            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">NTEE Code Suggestion</h2>

            <form onSubmit={(e) => sendEmail(e, 'template_r6c8hvi')} className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-sm font-medium">Your Name</label>
                <input
                  type="text"
                  name="from_name"
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
                  name="message"
                  rows="4"
                  className="w-full mt-1 px-3 py-2 bg-[#171821] border-b-4 text-white rounded-md"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 md:space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-600 text-white px-3 md:px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#A9DFD8] text-black font-semibold px-3 md:px-4 py-2 rounded-md hover:bg-[#88B3AE] transition duration-200"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-[#21222D] w-full max-w-md md:max-w-lg p-6 md:p-8 rounded-md shadow-lg relative text-white">
            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Tool Suggestion</h2>

            <form onSubmit={(e) => sendEmail(e, 'template_r6c8hvi')} className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-sm font-medium">Your Name</label>
                <input
                  type="text"
                  name="from_name"
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
                  name="message"
                  rows="4"
                  className="w-full mt-1 px-3 py-2 bg-[#171821] border-b-4 text-white rounded-md"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 md:space-x-4">
                <button
                  type="button"
                  onClick={closeToolModal}
                  className="bg-gray-600 text-white px-3 md:px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#A9DFD8] text-black font-semibold px-3 md:px-4 py-2 rounded-md hover:bg-[#88B3AE] transition duration-200"
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
