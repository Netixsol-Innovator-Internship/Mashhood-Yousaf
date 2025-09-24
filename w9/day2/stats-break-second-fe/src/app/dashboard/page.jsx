// // pages/dashboard.js
// import { useEffect } from "react";
// import { useRouter } from "next/router";
// import { isLoggedIn, getTokenPayload } from "../utils/auth";

// export default function Dashboard() {
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoggedIn()) {
//       router.push("/login");
//     }
//   }, [router]);

//   const userData = getTokenPayload();

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
//           <p className="text-gray-600">Welcome to your dashboard!</p>

//           {userData && (
//             <div className="mt-4 p-4 bg-gray-50 rounded">
//               <h2 className="text-lg font-semibold mb-2">User Information</h2>
//               <p>
//                 <strong>Email:</strong> {userData.email}
//               </p>
//               <p>
//                 <strong>Issued At:</strong>{" "}
//                 {new Date(userData.iat * 1000).toLocaleString()}
//               </p>
//               <p>
//                 <strong>Expires At:</strong>{" "}
//                 {new Date(userData.exp * 1000).toLocaleString()}
//               </p>
//             </div>
//           )}

//           <button
//             onClick={() => {
//               localStorage.removeItem("token");
//               router.push("/login");
//             }}
//             className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
