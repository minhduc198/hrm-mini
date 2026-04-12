"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";

export default function TestApiPage() {
  const { data: session, status } = useSession();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Session:", session);
      console.log("Access Token:", session?.accessToken);
      
      // Call API - token sẽ tự động được attach qua axios interceptor
      const response = await api.get("/employees");
      
      console.log("Response:", response.data);
      setEmployees(response.data);
    } catch (err: any) {
      console.error("Error fetching employees:", err);
      setError(err.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="p-8">Loading session...</div>;
  }

  if (status === "unauthenticated") {
    return <div className="p-8">Please login first</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test API /employees</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p><strong>Email:</strong> {session?.user?.email}</p>
        <p><strong>Name:</strong> {session?.user?.name}</p>
        <p><strong>Has Token:</strong> {session?.accessToken ? "✅ Yes" : "❌ No"}</p>
      </div>

      <button
        onClick={fetchEmployees}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Fetching..." : "Fetch Employees"}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {employees.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">
            Success! Found {employees.length} employees
          </h2>
          <pre className="mt-2 p-4 bg-green-100 rounded overflow-auto max-h-96">
            {JSON.stringify(employees, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
