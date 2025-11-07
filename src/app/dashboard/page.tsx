// src/app/(your-path)/BettingDashboard.tsx
"use client";

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
  FaCheckCircle,
  FaTimes
} from "react-icons/fa";

import {
  getProfile,
  placeBet,
  getPendingBets,
  initiateDeposit,
  UserProfileResponse,
  PendingBet,
  getBetHistory
} from "@/app/lib/api";  // adjust path if needed

export default function BettingDashboard() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const [betCode, setBetCode] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);

  // modals & states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  // pending bets
  const [pendingBets, setPendingBets] = useState<PendingBet[]>([]);
  const [isPendingLoading, setIsPendingLoading] = useState(true);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [selectedPendingBet, setSelectedPendingBet] = useState<PendingBet | null>(null);

  // deposit states
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number | "">("");
  const [isDepositing, setIsDepositing] = useState(false);

  // bet history
  const [betHistory, setBetHistory] = useState<PendingBet[]>([]);
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
        const profileData = await getProfile();
        setProfile(profileData);
        const betsData = await getPendingBets();
        setPendingBets(betsData);
        const historyData = await getBetHistory();
        setBetHistory(historyData);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setIsProfileLoading(false);
        setIsPendingLoading(false);
        setIsHistoryLoading(false);
      }
    }
    fetchData();
  }, []);

  const handlePlaceBet = async () => {
    if (!betCode.trim() || !selectedCompany || amount === "" || amount <= 0) return;

    setIsLoading(true);

    try {
      const req = {
        betCode: betCode.trim(),
        sportBook: selectedCompany,
        amount: amount as number,
      };
      const res = await placeBet(req);

      setModalMessage(`Bet placed successfully! Your new balance: ₦${res.newBalance.toLocaleString()}`);
      setIsModalOpen(true);

      // Reset form
      setBetCode("");
      setSelectedCompany("");
      setAmount("");

      // Refresh pending bets and history
      const betsData = await getPendingBets();
      setPendingBets(betsData);
      const historyData = await getBetHistory();
      setBetHistory(historyData);

      // Refresh profile balance
      const profileData = await getProfile();
      setProfile(profileData);
    } catch (err) {
      console.error("Bet placing failed:", err);
      setModalMessage("Failed to place bet. Please try again.");
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalMessage(null);
  };

  const handlePendingDetailClose = () => {
    setSelectedPendingBet(null);
    setIsPendingModalOpen(false);
  };

  const handleDeposit = async () => {
    if (depositAmount === "" || depositAmount <= 0) return;

    setIsDepositing(true);
    try {
      const res = await initiateDeposit(depositAmount as number);

      if (res.status && res.data.authorization_url) {
        window.location.href = res.data.authorization_url;
      } else {
        setModalMessage("Failed to start deposit. Please try again.");
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Deposit failed:", err);
      setModalMessage("Error initiating deposit. Try again.");
      setIsModalOpen(true);
    } finally {
      setIsDepositing(false);
      setIsDepositModalOpen(false);
      setDepositAmount("");
    }
  };

  const isFormValid = betCode.trim().length > 0 && selectedCompany && amount !== "" && amount > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-red-600 to-red-700 rounded-lg">
              <FaBolt className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold">DoubleBet</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition font-semibold text-sm"
          >
            <FaSignOutAlt className="w-5 h-5" />
            Logout
          </button>
        </div>

        <p className="text-slate-400 text-sm text-center">Your Ultimate Sports Betting Hub</p>

        {/* Profile Card */}
        <div className="bg-gradient-to-r from-red-900/30 to-slate-900/50 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-600/20 rounded-full border border-red-600/30">
                <FaUserAlt className="text-red-500 w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Welcome back</p>
                <h2 className="font-bold text-lg">
                  {isProfileLoading ? "Loading…" : profile?.name ?? "Guest"}
                </h2>
                <p className="text-red-400 font-semibold text-base">
                  ₦{isProfileLoading ? "..." : (profile?.balance ?? 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-sm flex items-center gap-2 transition"
              >
                <FaArrowUp /> Deposit
              </button>
              <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold text-sm flex items-center gap-2 transition">
                <FaArrowDown /> Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Bet Form */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold border-b border-slate-700 pb-4 mb-6">Place Your Bet</h3>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3 mb-6">
            <FaExclamationTriangle className="text-red-500 w-5 h-5 mt-1" />
            <p className="text-slate-300 text-sm">
              Remember: <span className="font-semibold text-green-400">You Win → double your stake</span>,{' '}
              <span className="font-semibold text-orange-400">You Lose → we return half your stake</span>.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="betcode" className="block text-sm font-semibold mb-2">Bet Code</label>
              <input
                id="betcode"
                type="text"
                placeholder="Enter your bet code"
                value={betCode}
                onChange={(e) => setBetCode(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none placeholder:text-slate-500 text-white"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-semibold mb-2">Sportsbook</label>
              <select
                id="company"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-white"
              >
                <option value="">Choose sportsbook</option>
                {BET_COMPANIES.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-semibold mb-2">Amount (₦)</label>
              <input
                id="amount"
                type="number"
                placeholder="Enter your stake"
                value={amount}
                onChange={(e) => {
                  const val = e.target.value;
                  setAmount(val === "" ? "" : Number(val));
                }}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none placeholder-text-slate-500 text-white"
              />
            </div>

            <button
              onClick={handlePlaceBet}
              disabled={!isFormValid || isLoading}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                isFormValid && !isLoading
                  ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  : "bg-slate-700 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Placing bet…" : "Place Bet"}
            </button>
          </div>
        </div>

        {/* Pending Bets */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <FaClock className="text-yellow-400" />
              <h3 className="text-lg font-semibold">Pending Bets</h3>
            </div>
            <button
              onClick={() => setIsPendingModalOpen(true)}
              className="text-sm text-slate-300 hover:text-white transition"
            >
              View All
            </button>
          </div>

          {isPendingLoading ? (
            <p className="text-slate-500 text-sm">Loading pending bets...</p>
          ) : pendingBets.length > 0 ? (
            <div className="space-y-3">
              {pendingBets.slice(0,2).map((bet) => (
                <div
                  key={bet.id}
                  onClick={() => { setSelectedPendingBet(bet); setIsPendingModalOpen(true); }}
                  className="cursor-pointer flex justify-between items-center bg-slate-800/60 border border-slate-700 rounded-lg p-3"
                >
                  <div>
                    <p className="font-semibold">{bet.sportBook}</p>
                    <p className="text-xs text-slate-400">Code: {bet.betCode} • {new Date(bet.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-300">₦{bet.amount.toLocaleString()}</p>
                    <p className="text-xs text-green-400">Potential Win: ₦{bet.potentialWin.toLocaleString()}</p>
                    <p className="text-xs text-red-400">Potential Loss: ₦{bet.potentialLoss.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No pending bets</p>
          )}
        </div>

        {/* Bet History */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 shadow-lg mb-10">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-3">
            <FaHistory className="text-blue-400" />
            <h3 className="text-lg font-semibold">Bet History</h3>
          </div>

          {isHistoryLoading ? (
            <p className="text-slate-500 text-sm">Loading bet history...</p>
          ) : betHistory.length > 0 ? (
            <div className="space-y-3">
              {betHistory.map((bet) => (
                <div 
                  key={bet.id} 
                  className={`flex justify-between items-center bg-slate-800/60 border rounded-lg p-3 ${
                    bet.status === "Won" ? "border-green-600/40" : 
                    bet.status === "Lost" ? "border-red-600/40" : 
                    "border-slate-700"
                  }`}
                >
                  <div>
                    <p className="font-semibold">{bet.sportBook}</p>
                    <p className="text-xs text-slate-400">Code: {bet.betCode} • {new Date(bet.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-300">₦{bet.amount.toLocaleString()}</p>
                    <p className={`text-xs font-semibold ${
                      bet.status === "Won" ? "text-green-400" : 
                      bet.status === "Lost" ? "text-red-400" : 
                      "text-yellow-400"
                    }`}>
                      {bet.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No previous bets</p>
          )}
        </div>
      </div>

      {/* Success/Error Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-slate-900 rounded-2xl p-8 shadow-lg w-11/12 max-w-md text-center text-white">
            <FaCheckCircle className="mx-auto text-green-400 w-14 h-14 mb-4" />
            <h2 className="text-2xl font-bold mb-2">{modalMessage}</h2>
            <button
              onClick={handleModalClose}
              className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Pending Bets Modal */}
      {isPendingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-slate-900 rounded-2xl w-full max-w-3xl p-6 shadow-xl text-white relative">
            <button
              onClick={handlePendingDetailClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaClock className="text-yellow-400" /> All Pending Bets
            </h2>

            {selectedPendingBet ? (
              <div className="mb-6">
                <p className="font-semibold">Sportsbook: {selectedPendingBet.sportBook}</p>
                <p className="text-sm text-slate-400">Code: {selectedPendingBet.betCode} • Placed: {new Date(selectedPendingBet.createdAt).toLocaleString()}</p>
                <p className="mt-2"><strong>Amount:</strong> ₦{selectedPendingBet.amount.toLocaleString()}</p>
                <p><strong>Potential Win:</strong> ₦{selectedPendingBet.potentialWin.toLocaleString()}</p>
                <p><strong>Potential Loss:</strong> ₦{selectedPendingBet.potentialLoss.toLocaleString()}</p>
                <p><strong>Status:</strong> {selectedPendingBet.status}</p>
                <button
                  className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                  onClick={handlePendingDetailClose}
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                {pendingBets.map((bet) => (
                  <div
                    key={bet.id}
                    onClick={() => setSelectedPendingBet(bet)}
                    className="cursor-pointer flex justify-between items-center bg-slate-800/60 border border-slate-700 rounded-lg p-3 hover:bg-slate-800/80"
                  >
                    <p>{bet.sportBook} • Code: {bet.betCode}</p>
                    <p>₦{bet.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-xl text-white relative">
            <button
              onClick={() => setIsDepositModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaArrowUp className="text-green-400" /> Make a Deposit
            </h2>

            <div className="space-y-4">
              <label htmlFor="depositAmount" className="block text-sm font-semibold">
                Amount (₦)
              </label>
              <input
                id="depositAmount"
                type="number"
                placeholder="Enter deposit amount"
                value={depositAmount}
                onChange={(e) =>
                  setDepositAmount(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-white"
              />

              <button
                onClick={handleDeposit}
                disabled={depositAmount === "" || depositAmount <= 0 || isDepositing}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  depositAmount !== "" && depositAmount > 0 && !isDepositing
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    : "bg-slate-700 cursor-not-allowed"
                }`}
              >
                {isDepositing ? "Processing..." : "Proceed to Paystack"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}