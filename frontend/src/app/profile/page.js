"use client";
import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import Sidebar from "../components/Sidebar";
import { useAuth } from '../components/context';
import Autosuggest from 'react-autosuggest';
import cities from "../components/cities";
import ntee_codes from "../components/ntee";
import { v4 } from 'uuid';
import { deleteObject } from 'firebase/storage';

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
  const [suggestions, setSuggestions] = useState([]);
  const [NteeSuggestions, setNteeSuggestions] = useState([]);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const imagesListRef = ref(storage, "images/");

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

    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
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
      let imageUrl = userData.image;

      if (userData.image) {
        try {
          const oldImageRef = ref(storage, userData.image);
          await getDownloadURL(oldImageRef);
          await deleteObject(oldImageRef);
        } catch (deleteError) {
          if (deleteError.code !== 'storage/object-not-found') {
            alert('Failed to delete previous image');
            return;
          }
        }
      }

      if (imageUpload) {
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        setUploadingImage(true);
        await uploadBytes(imageRef, imageUpload);
        const fullPath = imageRef.fullPath;
        imageUrl = await getDownloadURL(imageRef);
        setUserData((prev) => ({ ...prev, image: fullPath }));
        setUserData((prev) => ({ ...prev, image: imageUrl }));
      }

      await setDoc(doc(db, 'users', currentUser.uid), { ...userData, image: imageUrl }, { merge: true });
      alert('Profile updated successfully');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setUploadingImage(false);
    }
  };

  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : cities.filter(
      city => city.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const getSuggestionValue = suggestion => suggestion;

  const renderSuggestion = suggestion => (
    <div className="px-4 py-2 cursor-pointer hover:bg-[#A9DFD8] hover:text-black">
      {suggestion}
    </div>
  );

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onChange = (event, { newValue }) => {
    setUserData({
      ...userData,
      city: newValue
    });
  };

  const getNteeSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const nteeArray = Object.keys(ntee_codes).map(key => ({
      code: key,
      description: ntee_codes[key]
    }));
    return inputLength === 0 ? [] : nteeArray.filter(
      ntee =>
        ntee.code.toLowerCase().slice(0, inputLength) === inputValue ||
        ntee.description.toLowerCase().includes(inputValue)
    );
  };

  const getNteeSuggestionValue = suggestion => suggestion.code;

  const renderNteeSuggestion = suggestion => (
    <div className="px-4 py-2 cursor-pointer hover:bg-[#A9DFD8] hover:text-black">
      {suggestion.code} - {suggestion.description}
    </div>
  );

  const onNteeSuggestionsFetchRequested = ({ value }) => {
    setNteeSuggestions(getNteeSuggestions(value));
  };

  const onNteeSuggestionsClearRequested = () => {
    setNteeSuggestions([]);
  };

  const onNteeChange = (event, { newValue }) => {
    setUserData({
      ...userData,
      nteeCode: newValue
    });
  };

  const inputProps = {
    placeholder: 'Enter City',
    value: userData.city,
    onChange: onChange,
    className: "w-full mt-1 px-3 py-2 text-white-900 bg-[#171821] border-b-4 rounded-md "
  };

  const NteeInputProps = {
    placeholder: 'Enter NTEE Code or Description',
    value: userData.nteeCode,
    onChange: onNteeChange,
    className: "w-full px-3 py-2 text-white-900 bg-[#171821] border-b-4 rounded-md"
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading ...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen dashboard-color text-white font-sans">
      <Sidebar />
      
      <div className="flex flex-col flex-grow items-center justify-center p-8">
        <div className="flex flex-col items-center justify-center w-full max-w-5xl flex-col bg-[#21222D] rounded-md mx-10 p-10 pb-14 font-sans rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Profile</h1>
          <div className="flex space-x-8 w-full">
            <div className="w-1/3 bg-[#171821] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 rounded-md">
              <h2 className="text-xl font-semibold mb-2">User Information</h2>
              <div className="border-b border-gray-500 mb-5"></div>
              <img
                src={userData.image || 'https://via.placeholder.com/150'}
                alt="User"
                className="mb-2 w-24 h-24 rounded-md object-cover"
              />
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>First Name:</strong> {userData.firstName}</p>
              <p><strong>Last Name:</strong> {userData.lastName}</p>
              <p><strong>Organization:</strong> {userData.organization}</p>
              <p><strong>City:</strong> {userData.city}</p>
              <p><strong>State:</strong> {userData.state}</p>
              <p><strong>ZIP Code:</strong> {userData.zip}</p>
              <p><strong>NTEE Code:</strong> {userData.nteeCode}</p>
            </div>
            <div className="w-2/3 bg-[#171821] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 rounded-md">
              <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
              <div className="border-b border-gray-500  mb-5"></div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 bg-[#171821] border-b-4 text-white rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 bg-[#171821] border-b-4 text-white rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-small">Image</label>
                  <input
                    type="file"
                    onChange={(event) => {
                      setImageUpload(event.target.files[0]);
                    }}
                    className="w-full mt-1 px-3 py-2 bg-[#171821] border-b-4 text-white rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Organization</label>
                  <input
                    type="text"
                    name="organization"
                    value={userData.organization}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 bg-[#171821] border-b-4 text-white rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">State</label>
                  <select
                    name="state"
                    value={userData.state}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 bg-[#171821] border-b-4 text-white rounded-md"
                  >
                    {/* Add state options */}
                  </select>
                </div>
                <div>
                  <label className="block text-sm  font-medium">City</label>
                  <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={userData.zip}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 bg-[#171821] border-b-4 text-white rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">NTEE Code</label>
                  <Autosuggest
                    suggestions={NteeSuggestions}
                    onSuggestionsFetchRequested={onNteeSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onNteeSuggestionsClearRequested}
                    getSuggestionValue={getNteeSuggestionValue}
                    renderSuggestion={renderNteeSuggestion}
                    inputProps={NteeInputProps}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white font-medium bg-gray-800 rounded-md hover:bg-indigo-700 transition duration-300"
                >
                  {uploadingImage ? 'Uploading and Saving...' : 'Save'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
