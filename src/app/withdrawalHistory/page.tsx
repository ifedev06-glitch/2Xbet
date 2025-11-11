"use client";

import { useEffect, useState } from "react";
import { getUserWithdrawals, WithdrawalResponse } from "@/app/lib/api";
import { FaArrowLeft, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function WithdrawalHistory() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const withdrawalsPerPage = 10;

  useEffect(() => {
    async function loadWithdrawals() {
      try {
        const data = await getUserWithdrawals();
        const sorted = data.sort((a, b) => Number(b.id) - Number(a.id));
        setWithdrawals(sorted);
      } catch (err) {
        console.error("Failed to load withdrawal history:", err);
      } finally {
        setLoading(false);
      }
    }
    loadWithdrawals();
  }, []);

  // Pagination logic
  const indexOfLast = currentPage * withdrawalsPerPage;
  const indexOfFirst = indexOfLast - withdrawalsPerPage;
  const currentWithdrawals = withdrawals.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(withdrawals.length / withdrawalsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition font-semibold text-sm"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold">Withdrawal History</h1>
      </div>

      {/* Table or Empty State */}
      {loading ? (
        <p className="text-center text-gray-400">Loading history...</p>
      ) : withdrawals.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">
          You haven’t made any withdrawals yet.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 rounded-lg overflow-hidden text-sm">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Bank</th>
                  <th className="p-2 text-left">Account</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentWithdrawals.map((w) => (
                  <tr
                    key={w.id}
                    className="border-t border-gray-700 hover:bg-gray-800 transition"
                  >
                    <td className="p-2">{w.id}</td>
                    <td className="p-2">{w.bankName}</td>
                    <td className="p-2">
                      {w.accountNumber} ({w.accountName})
                    </td>
                    <td className="p-2 font-semibold">
                      ₦{w.amount.toLocaleString()}
                    </td>
                    <td className="p-2 flex items-center gap-2">
                      {["COMPLETED", "PAID"].includes(w.status) && (
                        <>
                          <FaCheckCircle className="text-green-500" />
                          <span className="text-green-400 font-medium">Paid</span>
                        </>
                      )}
                      {w.status === "PENDING" && (
                        <>
                          <FaClock className="text-yellow-500" />
                          <span className="text-yellow-400 font-medium">Pending</span>
                        </>
                      )}
                      {w.status === "REJECTED" && (
                        <>
                          <FaTimesCircle className="text-red-500" />
                          <span className="text-red-400 font-medium">Rejected</span>
                        </>
                      )}
                      {w.status === "CANCELLED" && (
                        <span className="text-slate-400 font-medium">Cancelled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
