// import React from "react";
// import ProtectedRoute from "../../components/ProtectedRoute";
// import Sidebar from "../../components/Sidebar";
// import Header from "../../components/Header";
// import { useGetReviewsQuery } from "../../api/shopCoApi";

// export default function Reviews() {
//   const { data, isLoading } = useGetReviewsQuery({ page: 1, limit: 20 });

//   return (
//     <ProtectedRoute>
//       <Sidebar />
//       <Header />
//       <main className="ml-64 pt-16 p-6">
//         <h1 className="text-3xl font-bold mb-6">Reviews</h1>
//         {isLoading ? (
//           <p>Loading reviews...</p>
//         ) : (
//           <table className="w-full border border-gray-300">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="border px-4 py-2">ID</th>
//                 <th className="border px-4 py-2">User ID</th>
//                 <th className="border px-4 py-2">Product ID</th>
//                 <th className="border px-4 py-2">Rating</th>
//                 <th className="border px-4 py-2">Comment</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.reviews.map(
//                 ({ id, userId, productId, rating, comment }) => (
//                   <tr key={id}>
//                     <td className="border px-4 py-2">{id}</td>
//                     <td className="border px-4 py-2">{userId}</td>
//                     <td className="border px-4 py-2">{productId}</td>
//                     <td className="border px-4 py-2">{rating}</td>
//                     <td className="border px-4 py-2">{comment}</td>
//                   </tr>
//                 )
//               )}
//             </tbody>
//           </table>
//         )}
//       </main>
//     </ProtectedRoute>
//   );
// }
