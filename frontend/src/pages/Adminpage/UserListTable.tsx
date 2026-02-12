import React from "react";
// Naye hooks import karo
import { 
  useGetAllStudentsAdminQuery, 
  useGetAllInstructorsAdminQuery 
} from "../../services/adminApi";

interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
  image: string;
}

const UserListTable = ({ type }: { type: "Student" | "Instructor" }) => {
  // 1. Sahi hook select karo base on 'type' prop
  const studentsQuery = useGetAllStudentsAdminQuery(undefined, {
    skip: type !== "Student", // Agar type Student nahi hai toh ye fetch mat karo
  });

  const instructorsQuery = useGetAllInstructorsAdminQuery(undefined, {
    skip: type !== "Instructor", // Agar type Instructor nahi hai toh fetch mat karo
  });

  // 2. Data aur Loading state extract karo
  const currentQuery = type === "Student" ? studentsQuery : instructorsQuery;
  const { data, isLoading, isError } = currentQuery;

  // RTK Query ka data structure backend response ke hisab se (response.data.data)
  const users: UserInfo[] = data?.data || [];

  return (
    <div className="mt-10 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-left border-collapse bg-[#161d29]">
        <thead>
          <tr className="bg-[#000814] text-gray-400 uppercase text-xs tracking-widest">
            <th className="p-4 border-b border-white/5 font-black text-white">User</th>
            <th className="p-4 border-b border-white/5 font-black text-white">Email</th>
            <th className="p-4 border-b border-white/5 font-black text-white">Account Type</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-white/5 transition-colors">
              <td className="p-4 flex items-center gap-3">
                <img src={user.image} alt="profile" className="w-8 h-8 rounded-full object-cover" />
                <span className="text-gray-200 font-medium">{user.firstName} {user.lastName}</span>
              </td>
              <td className="p-4 text-gray-400">{user.email}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${type === "Student" ? "bg-emerald-500/10 text-emerald-500" : "bg-pink-500/10 text-pink-500"}`}>
                  {user.accountType}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* States handling */}
      {isLoading && (
        <div className="p-10 text-center text-white flex justify-center items-center gap-2">
           <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
           Loading {type}s...
        </div>
      )}
      
      {isError && (
        <div className="p-10 text-center text-red-500">
          Failed to load {type} data. Please check your permissions.
        </div>
      )}

      {!isLoading && users.length === 0 && !isError && (
        <div className="p-10 text-center text-gray-500">No {type}s found.</div>
      )}
    </div>
  );
};

export default UserListTable;