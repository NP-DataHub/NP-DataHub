"use client";
import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Sidebar from "../components/Sidebar";
import { useAuth } from '../components/context';

export default function Profile() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    image: '',
    organization: '',
    city: '',
    state: '',
    zip: '',
    nteeCode: ''
  });
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'users', currentUser.uid), userData, { merge: true });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);

    const storageRef = ref(storage, `images/${currentUser.uid}/${file.name}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    setUserData({
      ...userData,
      image: imageUrl
    });

    setUploadingImage(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex dashboard-color text-white font-sans">
      <Sidebar />
      <div className="flex-col w-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="flex space-x-8">
          <div className="w-1/3 bg-gray-800 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-2">User Information</h2>
            <img src={userData.image || 'https://via.placeholder.com/150'} alt="User" className="mb-2 w-24 h-24 rounded-full object-cover" />
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>First Name:</strong> {userData.firstName}</p>
            <p><strong>Last Name:</strong> {userData.lastName}</p>
            <p><strong>Organization:</strong> {userData.organization}</p>
            <p><strong>City:</strong> {userData.city}</p>
            <p><strong>State:</strong> {userData.state}</p>
            <p><strong>ZIP Code:</strong> {userData.zip}</p>
            <p><strong>NTEE Code:</strong> {userData.nteeCode}</p>
          </div>
          <div className="w-2/3 bg-gray-700 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 text-gray-900 bg-gray-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 text-gray-900 bg-gray-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={userData.image}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 text-gray-900 bg-gray-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Organization</label>
                <input
                  type="text"
                  name="organization"
                  value={userData.organization}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 text-gray-900 bg-gray-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">City</label>
                <input
                  type="text"
                  name="city"
                  value={userData.city}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 text-gray-900 bg-gray-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">State</label>
                <input
                  type="text"
                  name="state"
                  value={userData.state}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 text-gray-900 bg-gray-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">ZIP Code</label>
                <input
                  type="text"
                  name="zip"
                  value={userData.zip}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 text-gray-900 bg-gray-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">NTEE Code</label>
                <input
                  type="text"
                  name="nteeCode"
                  value={userData.nteeCode}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 text-gray-900 bg-gray-200 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white font-medium bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-300"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
