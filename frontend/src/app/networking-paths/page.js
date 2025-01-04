"use client";
import Sidebar from "../components/Sidebar";
import React, { useState, useEffect, useRef } from 'react';
import Footer from '../components/dashboard_footer';
import SPIN from "../components/SPIN";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase"; // Your Firestore instance
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../components/context"; // Assuming you have a user auth context

export default function NetworksPaths() {  // Component name updated to start with an uppercase letter
    const [isLoading, setIsLoading] = useState(true); // State to control the loading state
    const [isDarkMode, setIsDarkMode] = useState(false); 

    // If the sidebar's user data is loaded, stop the loading screen
    const handleUserDataLoaded = () => {
        setIsLoading(false);
    };

    const [isPremium, setIsPremium] = useState(false);
    const { currentUser } = useAuth(); // Get the currently logged-in user
      

    useEffect(() => {
      const checkSubscription = async () => {
        if (currentUser) {
          try {
            const userRef = doc(db, "users", currentUser.uid); // Adjust Firestore collection path
            const userDoc = await getDoc(userRef);
  
            if (userDoc.exists()) {
              const data = userDoc.data();
              console.log("User Data:", data);
  
              const now = new Date();
              const expiration = data.subscription_expiration
                ? new Date(data.subscription_expiration.seconds * 1000) // Convert Firestore Timestamp to JavaScript Date
                : null;
  
              console.log("Current Time:", now);
              console.log("Expiration Time:", expiration);
  
              if (data.premium_user && expiration && expiration > now) {
                setIsPremium(true);
              } else {
                setIsPremium(false);
              }
            } else {
              console.warn("User document does not exist.");
            }
          } catch (error) {
            console.error("Error checking subscription:", error.message);
          }
        }
  
        setIsLoading(false);
      };
  
      checkSubscription();
    }, [currentUser, db]);

    const handleSubscription = async () => {
      try {
        // Await the resolved Stripe instance from loadStripe
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
        
        if (!stripe) {
          throw new Error("Stripe has not been properly initialized.");
        }
    
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: currentUser.uid }), // Ensure currentUser is defined
        });
    
        const { sessionId } = await response.json();
    
        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({ sessionId });
    
        if (error) {
          console.error("Stripe Checkout Error:", error.message);
        }
      } catch (error) {
        console.error("Error handling subscription:", error.message);
      }
    };
    
    

    const LoadingComponent = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );
    // Load the theme from local storage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const darkModeEnabled = savedTheme === "dark";
        setIsDarkMode(darkModeEnabled);
        document.documentElement.classList.toggle("dark", darkModeEnabled);
    }, []);

    // Handle theme toggle
    const handleThemeToggle = (newTheme) => {
        setIsDarkMode(newTheme === "dark");
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    if (!isPremium) {
        return (
          <div className="paywall bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">Unlock Premium Access</h2>
            <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
              Gain full access to all premium features that empower you to make better decisions.
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800">
                <h3 className="text-xl font-semibold mb-2 text-blue-600">Fiscal Health</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Analyze nonprofit fiscal health and compare key financial variables for insights.
                </p>
              </div>
              <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800">
                <h3 className="text-xl font-semibold mb-2 text-green-600">Region Health</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Benchmark nonprofit performance based on regional data to identify community needs.
                </p>
              </div>
              <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800">
                <h3 className="text-xl font-semibold mb-2 text-purple-600">Anomaly Detection</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Detect fiscal anomalies in nonprofits using machine learning algorithms.
                </p>
              </div>
              <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800">
                <h3 className="text-xl font-semibold mb-2 text-yellow-600">News Feed</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Stay informed with real-time news updates relevant to nonprofit sectors.
                </p>
              </div>
              <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800">
                <h3 className="text-xl font-semibold mb-2 text-indigo-600">Calculator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Estimate and budget growth using detailed fiscal variables.
                </p>
              </div>
              <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800">
                <h3 className="text-xl font-semibold mb-2 text-pink-600">Collaborative Lab</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Discover potential partnerships with nonprofits in your community.
                </p>
              </div>
            </div>
            <button
              onClick={handleSubscription}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition-colors"
            >
              Start Free Trial Now
            </button>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Already subscribed? Refresh the page after upgrading to access all features.
            </p>
          </div>
        );
      }

    return (
        <div>
            <div className={isDarkMode ? "dashboard-color text-white transition-colors duration-300 font-sans" : "bg-[#ffffff] text-black transition-colors duration-300 font-sans"}>
                {/* Sidebar will be hidden if isLoading is true */}
                <Sidebar onUserDataLoaded={handleUserDataLoaded} currentPage="/networking-paths" onThemeToggle = {handleThemeToggle} isDarkMode={isDarkMode}/>

                {/* Show a loading spinner for the main content until user data is loaded */}
                {isLoading ? (
                    <LoadingComponent />
                ) : (
                    <div>
                        <div className="flex-col">
                            <SPIN isDarkMode={isDarkMode} />
                        </div>
                        <Footer isDarkMode={isDarkMode} />
                    </div>
                )}
            </div>
        </div>
    );
}
