import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function AdminDashboardPage() {
    const { getToken } = useAuth();
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();
    
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Kick them out if they aren't loaded or aren't an admin
        if (isLoaded && user?.publicMetadata?.role !== "admin") {
            navigate("/build");
            return;
        }

        const fetchAdminData = async () => {
            try {
                const token = await getToken();
                const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Failed to fetch admin data");
                
                const data = await response.json();
                setDashboardData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (isLoaded) fetchAdminData();
    }, [isLoaded, user, navigate, getToken]);

    if (loading || !isLoaded) return <div className="flex h-screen items-center justify-center bg-[rgb(25,25,25)] text-white text-xl">Loading Command Center...</div>;
    if (error) return <div className="flex h-screen items-center justify-center bg-[rgb(25,25,25)] text-red-500 text-xl">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-[rgb(20,20,20)] text-white font-sans p-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            Admin Command Center
                        </h1>
                        <p className="text-gray-400 mt-2">Welcome back, Commander {user?.firstName}.</p>
                    </div>
                    <Link to="/build" className="px-6 py-2 rounded-xl bg-[rgb(35,35,35)] border border-gray-700 hover:bg-[rgb(45,45,45)] transition">
                        Back to Builder
                    </Link>
                </div>

                {/* KPI Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-[rgb(30,30,30)] border border-purple-500/30 p-6 rounded-2xl">
                        <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Users</p>
                        <p className="text-5xl font-bold text-white">{dashboardData?.stats.total_users}</p>
                    </div>
                    <div className="bg-[rgb(30,30,30)] border border-cyan-500/30 p-6 rounded-2xl">
                        <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Published Sites</p>
                        <p className="text-5xl font-bold text-white">{dashboardData?.stats.published_count}</p>
                    </div>
                    <div className="bg-[rgb(30,30,30)] border border-gray-700 p-6 rounded-2xl md:col-span-2 flex items-center justify-around">
                        <div className="text-center">
                            <p className="text-gray-400 text-xs uppercase mb-1">Classic</p>
                            <p className="text-2xl font-bold">{dashboardData?.stats.classic_templates}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-xs uppercase mb-1">Minimalist</p>
                            <p className="text-2xl font-bold">{dashboardData?.stats.minimalist_templates}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-xs uppercase mb-1">Technical</p>
                            <p className="text-2xl font-bold">{dashboardData?.stats.technical_templates}</p>
                        </div>
                    </div>
                </div>

                {/* Recent Users Table */}
                <div className="bg-[rgb(30,30,30)] border border-gray-700 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700 bg-[rgb(35,35,35)]">
                        <h2 className="text-xl font-bold">Recent Sign-ups</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-700/50 text-gray-400 text-sm uppercase">
                                    <th className="px-6 py-4 font-medium">Username</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium">Template</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {dashboardData?.recent_users.map((u, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition">
                                        <td className="px-6 py-4 font-medium">{u.username}</td>
                                        <td className="px-6 py-4 text-gray-400">{u.email}</td>
                                        <td className="px-6 py-4 capitalize">{u.template}</td>
                                        <td className="px-6 py-4">
                                            {u.is_published ? (
                                                <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold">
                                                    Drafting
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {dashboardData?.recent_users.length === 0 && (
                            <div className="p-8 text-center text-gray-500">No users found in database.</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}