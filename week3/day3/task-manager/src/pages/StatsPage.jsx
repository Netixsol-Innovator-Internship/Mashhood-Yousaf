import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";

const StatsPage = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsRes = await axios.get(
          "https://day1-back-end.vercel.app/api/tasks/stats"
        );
        const usersRes = await axios.get(
          "https://day1-back-end.vercel.app/api/users"
        );

        console.log("response while gettind stats for dashboard", statsRes);
        console.log("response while gettind users for dashboard", usersRes);

        setStats(statsRes.data.data);
        setUsers(usersRes.data.users);

        console.log("stats", stats);
        console.log("users", usersRes.data.users);
      } catch (err) {
        setError("Failed to fetch data");
        console.log(
          "err cathed in statsPAge while getting stats and users",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if(loading){
    return <Loader />
  }
  
  return (
    <div className="p-4 font-sans sm:p-6 md:p-8 max-w-7xl mx-auto">
      <p className="text-1xl md:text-2xl font-bold mb-6 text-center">
        Our Globally Registered User and thier Tasks
      </p>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-semibold">{users.length}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-600">Total Tasks</p>
          <p className="text-2xl font-semibold">{stats.totalTask || 0}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-600">Completed Tasks</p>
          <p className="text-2xl font-semibold">{stats.completedTasks || 0}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-600">Pending Tasks</p>
          <p className="text-2xl font-semibold">{stats.pendingTask || 0}</p>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center mb-8">
          <div className="sm:flex-auto">
            <h2 className="text-3xl font-bold text-gray-900">
              User Management
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              A list of all registered users including their details
            </p>
          </div>
          {/* <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add user
            </button>
          </div> */}
        </div>

        <div className="mt-8 flow-root">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-3 py-6 text-center text-sm text-gray-500"
                        >
                          <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                              No users found
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Get started by adding a new user.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      users.map((user, index) => (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {index + 1}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800 font-medium">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="flex items-center justify-center h-full w-full rounded-full bg-indigo-100 text-indigo-600 font-bold">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">
                                  {user.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
