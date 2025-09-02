"use client";

import AuctionText from "../../components/AuctionText";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import profilePic from "../../../public/heroImg.jpg";
import Image from "next/image";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const user = useSelector((state) => state.auth.user);

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    userId: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData({
          username: decoded.username || "",
          email: decoded.email || "",
          userId: decoded.userId || "",
        });
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  return (
    <>
      <AuctionText
        title="Profile"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbText="Profile"
      />

      <div className="flex p-6 space-x-6 max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="flex flex-col space-y-3 rounded-md p-4 w-70">
          <button
            onClick={() => setActiveTab("personal")}
            className={`text-[rgba(46,61,131,1)] font-semibold px-4 py-2 rounded-l-md text-left ${
              activeTab === "personal"
                ? "bg-[rgba(241,242,255,1)] border-r-4 border-yellow-400"
                : "hover:bg-[rgba(241,242,255,1)]"
            }`}
          >
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab("cars")}
            className={`text-[rgba(46,61,131,1)] font-semibold px-4 py-2 rounded-l-md text-left ${
              activeTab === "cars"
                ? "bg-[rgba(241,242,255,1)] border-r-4 border-yellow-400"
                : "hover:bg-[rgba(241,242,255,1)]"
            }`}
          >
            My Cars
          </button>
          <button
            onClick={() => setActiveTab("bids")}
            className={`text-[rgba(46,61,131,1)] font-semibold px-4 py-2 rounded-l-md text-left ${
              activeTab === "bids"
                ? "bg-[rgba(241,242,255,1)] border-r-4 border-yellow-400"
                : "hover:bg-[rgba(241,242,255,1)]"
            }`}
          >
            My Bids
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`text-[rgba(46,61,131,1)] font-semibold px-4 py-2 rounded-l-md text-left ${
              activeTab === "wishlist"
                ? "bg-[rgba(241,242,255,1)] border-r-4 border-yellow-400"
                : "hover:bg-[rgba(241,242,255,1)]"
            }`}
          >
            Wishlist
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-md shadow-md">
          {/* Header */}
          <div className="bg-[rgba(46,61,131,1)] rounded-t-md px-6 py-3 flex justify-between items-center">
            <h2 className="text-white font-semibold text-lg capitalize">
              {activeTab === "personal" && "Personal Information"}
              {activeTab === "cars" && "My Cars"}
              {activeTab === "bids" && "My Bids"}
              {activeTab === "wishlist" && "Wishlist"}
            </h2>
          </div>

          {/* Personal Information */}
          {activeTab === "personal" && (
            <div className="flex items-center space-x-6 px-6 py-8 ">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300">
                <Image
                  src={profilePic}
                  alt="Profile Picture"
                  width={96}
                  height={96}
                  objectFit="cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full text-sm text-gray-600">
                <div className="flex space-x-2">
                  <span className="font-semibold text-[rgba(46,61,131,1)]">
                    Full Name
                  </span>
                  <span className="text-gray-400">{userData.username}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-semibold text-[rgba(46,61,131,1)]">
                    Email
                  </span>
                  <span className="text-gray-400">{userData.email}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-semibold text-[rgba(46,61,131,1)]">
                    Mobile Number
                  </span>
                  <span className="text-gray-400">+****-*******</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-semibold text-[rgba(46,61,131,1)]">
                    Nationality
                  </span>
                  <span className="text-gray-400">Pakistan</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-semibold text-[rgba(46,61,131,1)]">
                    ID Type
                  </span>
                  <span className="text-gray-400">Pakistan</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-semibold text-[rgba(46,61,131,1)]">
                    ID Number
                  </span>
                  <span className="text-gray-400 max-w-[80px] md:max-w-full inline-block break-words">
                    {userData.userId}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Cars */}
          {activeTab === "cars" && (
            <div className="p-6">
              {user?.myCars?.length > 0 ? (
                <ul>
                  {user.myCars.map((car) => (
                    <li key={car._id} className="mb-4 border-b pb-2">
                      <h4 className="font-semibold text-lg">
                        {car.make} {car.model} - {car.name}
                      </h4>
                      <p>Category: {car.category}</p>
                      <p>Year: {car.year}</p>
                      <p>Price: PKR {car.price.toLocaleString()}</p>
                      <p>Description: {car.description}</p>
                      <img
                        src={car.image}
                        alt={`${car.make} ${car.model}`}
                        className="w-48 mt-2 rounded shadow"
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No cars found.</p>
              )}
            </div>
          )}

          {/* Bids */}
          {activeTab === "bids" && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user?.myBids?.length > 0 ? (
                user.myBids.map((bid) => (
                  <div
                    key={bid._id}
                    className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center text-center"
                  >
                    {/* Car Name */}
                    <h2 className="text-sm font-semibold text-[rgba(46,61,131,1)] mb-2">
                      {bid.car.name}
                    </h2>

                    {/* Car Image */}
                    <img
                      src={bid.car.image}
                      alt={bid.car.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />

                    {/* Bid Amounts */}
                    <div className="flex justify-between w-full px-4 mb-4">
                      <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md w-1/2 mx-1">
                        <p className="text-sm font-medium">Winning Bid</p>
                        <p className="text-lg font-bold">
                          ${bid.car.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md w-1/2 mx-1">
                        <p className="text-sm font-medium">Your Current Bid</p>
                        <p className="text-lg font-bold">
                          ${bid.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Placeholder Countdown & Total Bids */}
                    <div className="flex justify-between items-center w-full px-4 text-gray-600 text-sm mb-4">
                      <div className="flex gap-1">
                        <div className="text-center">
                          <p className="font-semibold">31</p>
                          <p>Days</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">20</p>
                          <p>Hours</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">40</p>
                          <p>mins</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">25</p>
                          <p>secs</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-right">130</p>
                        <p>Total Bids</p>
                      </div>
                    </div>

                    {/* Submit a Bid Button */}
                  </div>
                ))
              ) : (
                <p>No bids found.</p>
              )}
            </div>
          )}

          {/* Wishlist */}
          {activeTab === "wishlist" && (
            <div className="p-6">
              {user?.wishlist?.length > 0 ? (
                <ul>
                  {user.wishlist.map((item) => (
                    <li key={item._id} className="mb-4 border-b pb-2">
                      <h4 className="font-semibold">
                        {item.name || item.title}
                      </h4>
                      <p>Description: {item.description || "No description"}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No wishlist items found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
