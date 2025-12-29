import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getUserDashboardAPI } from "../services/userService";
import { UserListItem } from "../types/user.types";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const {setUser,removeLocalStorageUser} =useAuth()
  const { handleApiError } = useApiErrorHandler(setUser,removeLocalStorageUser);
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const dashboardData = await getUserDashboardAPI({search:searchQuery,pageSize:pageSize.toString(),page:currentPage.toString()});
      setTotalPages(dashboardData.totalPages);
      setUsers(dashboardData.userList);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Users Dashboard
            </h2>
            <form className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchQuery(e.target.value)
                }}
                placeholder="Search by email..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No users found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                        ID
                      </th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.userId}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-400 text-sm font-mono">
                          #{user.userId.slice(-6)}
                        </td>
                        <td className="py-3 px-4 text-white">{user.email}</td>
                        <td className="py-3 px-4 text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>

                <span className="text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
