"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaBolt,
  FaUserAlt,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaClock,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";

// Mock API functions for demo
const mockAPI = {
  getProfile: async () => ({ name: "John Doe", balance: 25000 }),
  getPendingBets: async () => [
    { id: 1, sportBook: "SportyBet", betCode: "ABC123", amount: 5000, potentialWin: 10000, potentialLoss: 2500, status: "Pending", createdAt: new Date().toISOString() },
    { id: 2, sportBook: "Bet9ja", betCode: "XYZ789", amount: 3000, potentialWin: 6000, potentialLoss: 1500, status: "Pending", createdAt: new Date().toISOString() }
  ],
  getBetHistory: async () => [
    { id: 3, sportBook: "BetKing", betCode: "DEF456", amount: 2000, status: "Won", createdAt: new Date().toISOString() },
    { id: 4, sportBook: "1XBet", betCode: "GHI012", amount: 4000, status: "Lost", createdAt: new Date().toISOString() }
  ],
};

export default function BettingDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const [betCode, setBetCode] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const [pendingBets, setPendingBets] = useState<any[]>([]);
  const [isPendingLoading, setIsPendingLoading] = useState(true);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [selectedPendingBet, setSelectedPendingBet] = useState<any>(null);

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number | "">("");
  const [isDepositing, setIsDepositing] = useState(false);

  const [betHistory, setBetHistory] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const BET_COMPANIES = [
    { id: "sportybet", name: "SportyBet" },
    { id: "betking", name: "BetKing" },
    { id: "betano", name: "Betano" },
    { id: "bet9ja", name: "Bet9ja" },
    { id: "paripesa", name: "Paripesa" },
    { id: "1xbet", name: "1XBet" },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const profileData = await mockAPI.getProfile();
        const betsData = await mockAPI.getPendingBets();
        const historyData = await mockAPI.getBetHistory();
        setProfile(profileData);
        setPendingBets(betsData);
        setBetHistory(historyData);
      } finally {
        setIsProfileLoading(false);
        setIsPendingLoading(false);
        setIsHistoryLoading(false);
      }
    }
    fetchData();
  }, []);

  const handlePlaceBet = async () => {
    if (!betCode || !selectedCompany || !amount) return;
    setIsLoading(true);
    setTimeout(() => {
      setModalMessage(`✅ Bet placed successfully! New balance: ₦${((profile?.balance || 0) + 5000).toLocaleString()}`);
      setIsModalOpen(true);
      setBetCode("");
      setSelectedCompany("");
      setAmount("");
      setIsLoading(false);
    }, 1000);
  };

  const handleDeposit = async () => {
    if (!depositAmount) return;
    setIsDepositing(true);
    setTimeout(() => {
      setModalMessage("Redirecting to payment gateway...");
      setIsModalOpen(true);
      setIsDepositing(false);
      setIsDepositModalOpen(false);
    }, 1000);
  };

  const handleLogout = () => {
    alert("Logged out!");
  };

  const isFormValid = betCode && selectedCompany && amount && amount > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="p-2 bg-gradient-to-br from-red-600 to-red-700 rounded-lg">
              <FaBolt className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">DoubleBet</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-sm"
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Responsive Profile Card */}
        <div className="bg-gradient-to-r from-red-900/30 to-slate-900/50 border border-slate-700 rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            {/* User Info */}
            <div className="flex gap-3 sm:gap-4 items-center">
              <div className="p-2 sm:p-3 bg-red-600/20 rounded-full border border-red-600/30 flex-shrink-0">
                <FaUserAlt className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Welcome back</p>
                <h2 className="font-bold text-base sm:text-lg">{profile?.name ?? "Loading..."}</h2>
                <p className="text-red-400 font-semibold text-sm sm:text-base">
                  ₦{(profile?.balance ?? 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
              >
                <FaArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Deposit</span>
              </button>
              <Link
      href="/withdrawal"
      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
    >
      <FaArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />
      <span>Withdraw</span>
    </Link>
            </div>
          </div>
        </div>

        {/* Bet Form */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold border-b border-slate-700 pb-3 sm:pb-4 mb-4 sm:mb-6">Place Bet</h3>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4 flex gap-2 sm:gap-3 mb-4 sm:mb-6">
            <FaExclamationTriangle className="text-red-500 w-4 h-4 sm:w-5 sm:h-5 mt-0.5 sm:mt-1 flex-shrink-0" />
            <p className="text-slate-300 text-xs sm:text-sm">
              <span className="text-green-400 font-semibold">Win → double your stake</span>,{" "}
              <span className="text-orange-400 font-semibold">Lose → get half back</span>.
            </p>
          </div>

          <input
            value={betCode}
            onChange={(e) => setBetCode(e.target.value)}
            placeholder="Enter bet code"
            className="w-full p-2.5 sm:p-3 mb-3 sm:mb-4 bg-slate-800 border border-slate-600 rounded-lg focus:ring-red-500 outline-none text-sm sm:text-base"
          />
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full p-2.5 sm:p-3 mb-3 sm:mb-4 bg-slate-800 border border-slate-600 rounded-lg focus:ring-red-500 outline-none text-sm sm:text-base"
          >
            <option value="">Select Company</option>
            {BET_COMPANIES.map((b) => (
              <option key={b.id}>{b.name}</option>
            ))}
          </select>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Enter stake"
            className="w-full p-2.5 sm:p-3 mb-3 sm:mb-4 bg-slate-800 border border-slate-600 rounded-lg focus:ring-red-500 outline-none text-sm sm:text-base"
          />
          <button
            disabled={!isFormValid || isLoading}
            onClick={handlePlaceBet}
            className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base ${
              isFormValid
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:to-red-800"
                : "bg-slate-700 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Placing..." : "Place Bet"}
          </button>
        </div>

        {/* Pending Bets */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-4 sm:p-6">
          <div className="flex justify-between items-center mb-3 sm:mb-4 border-b border-slate-700 pb-2 sm:pb-3">
            <div className="flex gap-2 items-center">
              <FaClock className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5" />
              <h3 className="text-base sm:text-lg font-semibold">Pending Bets</h3>
            </div>
            <button
              onClick={() => setIsPendingModalOpen(true)}
              className="text-xs sm:text-sm text-slate-300 hover:text-white"
            >
              View All
            </button>
          </div>

          {isPendingLoading ? (
            <p className="text-slate-500 text-sm">Loading…</p>
          ) : pendingBets.length > 0 ? (
            pendingBets.slice(0, 2).map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  setSelectedPendingBet(b);
                  setIsPendingModalOpen(true);
                }}
                className="cursor-pointer flex justify-between bg-slate-800/60 border border-slate-700 rounded-lg p-2.5 sm:p-3 mb-2"
              >
                <div>
                  <p className="font-semibold text-sm sm:text-base">{b.sportBook}</p>
                  <p className="text-xs text-slate-400">Code: {b.betCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm">₦{b.amount.toLocaleString()}</p>
                  <p className="text-xs text-green-400">
                    Win: ₦{b.potentialWin.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm">No pending bets</p>
          )}
        </div>

        {/* Bet History */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-4 sm:p-6 mb-10">
          <div className="flex gap-2 mb-3 sm:mb-4 border-b border-slate-700 pb-2 sm:pb-3">
            <FaHistory className="text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
            <h3 className="text-base sm:text-lg font-semibold">Bet History</h3>
          </div>
          {isHistoryLoading ? (
            <p className="text-slate-500 text-sm">Loading…</p>
          ) : betHistory.length ? (
            betHistory.map((b) => (
              <div
                key={b.id}
                className={`flex justify-between bg-slate-800/60 border rounded-lg p-2.5 sm:p-3 mb-2 ${
                  b.status === "Won"
                    ? "border-green-600/40"
                    : b.status === "Lost"
                    ? "border-red-600/40"
                    : "border-slate-700"
                }`}
              >
                <div>
                  <p className="font-semibold text-sm sm:text-base">{b.sportBook}</p>
                  <p className="text-xs text-slate-400">{b.betCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm">₦{b.amount.toLocaleString()}</p>
                  <p
                    className={`text-xs ${
                      b.status === "Won"
                        ? "text-green-400"
                        : b.status === "Lost"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {b.status}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm">No history</p>
          )}
        </div>
      </div>

      {/* Pending Bet Modal */}
      {isPendingModalOpen && selectedPendingBet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg p-4 sm:p-6 relative">
            <button
              onClick={() => setIsPendingModalOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-400 hover:text-white transition text-xl"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4 sm:mb-6 border-b border-slate-700 pb-2 sm:pb-3">
              <FaClock className="text-yellow-400 text-base sm:text-lg" />
              <h2 className="text-lg sm:text-xl font-semibold text-white">Pending Bet Details</h2>
            </div>

            <div className="space-y-3 sm:space-y-4 text-slate-300 text-sm sm:text-base">
              <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-slate-800">
                <span className="text-slate-400">Sportbook</span>
                <span className="font-medium">{selectedPendingBet.sportBook}</span>
              </div>
              <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-slate-800">
                <span className="text-slate-400">Bet Code</span>
                <span className="font-medium">{selectedPendingBet.betCode}</span>
              </div>
              <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-slate-800">
                <span className="text-slate-400">Stake Amount</span>
                <span className="font-semibold text-white">₦{selectedPendingBet.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-slate-800">
                <span className="text-slate-400">Potential Win</span>
                <span className="font-semibold text-green-400">₦{selectedPendingBet.potentialWin.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-slate-800">
                <span className="text-slate-400">Potential Loss</span>
                <span className="font-semibold text-red-400">₦{selectedPendingBet.potentialLoss.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-2 sm:pb-3">
                <span className="text-slate-400">Status</span>
                <span className="font-semibold text-yellow-400">{selectedPendingBet.status}</span>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 border-t border-slate-800 pt-3 sm:pt-4 flex justify-end">
              <button
                onClick={() => setIsPendingModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs sm:text-sm text-slate-300 hover:text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6 relative">
            <button
              onClick={() => setIsDepositModalOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-400 hover:text-white transition text-xl"
            >
              ✕
            </button>

            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <FaArrowUp className="text-green-400" /> Make a Deposit
            </h2>

            <input
              type="number"
              placeholder="Enter deposit amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full p-2.5 sm:p-3 mb-4 bg-slate-800 border border-slate-600 rounded-lg focus:ring-green-500 outline-none text-sm sm:text-base"
            />

            <button
              onClick={handleDeposit}
              disabled={!depositAmount || depositAmount <= 0 || isDepositing}
              className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base ${
                depositAmount && depositAmount > 0 && !isDepositing
                  ? "bg-gradient-to-r from-green-600 to-green-700 hover:to-green-800"
                  : "bg-slate-700 cursor-not-allowed"
              }`}
            >
              {isDepositing ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-sm text-center">
            <p className="text-base sm:text-lg mb-4">{modalMessage}</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-sm sm:text-base"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}