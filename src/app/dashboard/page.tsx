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
import {
  getProfile,
  placeBet,
  getPendingBets,
  initiateDeposit,
  UserProfileResponse,
  PendingBet,
  getBetHistory,
} from "@/app/lib/api"; // adjust if needed

export default function BettingDashboard() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const [betCode, setBetCode] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const [pendingBets, setPendingBets] = useState<PendingBet[]>([]);
  const [isPendingLoading, setIsPendingLoading] = useState(true);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [selectedPendingBet, setSelectedPendingBet] = useState<PendingBet | null>(null);

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number | "">("");
  const [isDepositing, setIsDepositing] = useState(false);

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
        const betsData = await getPendingBets();
        const historyData = await getBetHistory();
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
    try {
      const res = await placeBet({ betCode, sportBook: selectedCompany, amount: amount as number });
      setModalMessage(`✅ Bet placed successfully! New balance: ₦${res.newBalance.toLocaleString()}`);
      setIsModalOpen(true);
      setBetCode("");
      setSelectedCompany("");
      setAmount("");
      setPendingBets(await getPendingBets());
      setBetHistory(await getBetHistory());
      setProfile(await getProfile());
    } catch {
      setModalMessage("❌ Failed to place bet. Please try again.");
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount) return;
    setIsDepositing(true);
    try {
      const res = await initiateDeposit(depositAmount as number);
      if (res?.data?.authorization_url) window.location.href = res.data.authorization_url;
      else setModalMessage("Deposit failed. Try again.");
    } catch {
      setModalMessage("Deposit error. Try again.");
    } finally {
      setIsDepositing(false);
      setIsDepositModalOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
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
            <h1 className="text-3xl font-bold">DoubleBet</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Profile */}
        <div className="bg-gradient-to-r from-red-900/30 to-slate-900/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-red-600/20 rounded-full border border-red-600/30">
                <FaUserAlt className="text-red-500 w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Welcome back</p>
                <h2 className="font-bold text-lg">{profile?.name ?? "Loading..."}</h2>
                <p className="text-red-400 font-semibold">
                  ₦{(profile?.balance ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold flex items-center gap-2"
              >
                <FaArrowUp /> Deposit
              </button>
              <Link href="/withdrawal">
                <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold flex items-center gap-2">
                  <FaArrowDown /> Withdraw
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bet Form */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-xl font-semibold border-b border-slate-700 pb-4 mb-6">Place Bet</h3>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3 mb-6">
            <FaExclamationTriangle className="text-red-500 w-5 h-5 mt-1" />
            <p className="text-slate-300 text-sm">
              <span className="text-green-400 font-semibold">Win → double your stake</span>,{" "}
              <span className="text-orange-400 font-semibold">Lose → get half back</span>.
            </p>
          </div>

          <input
            value={betCode}
            onChange={(e) => setBetCode(e.target.value)}
            placeholder="Enter bet code"
            className="w-full p-3 mb-4 bg-slate-800 border border-slate-600 rounded-lg focus:ring-red-500 outline-none"
          />
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full p-3 mb-4 bg-slate-800 border border-slate-600 rounded-lg focus:ring-red-500 outline-none"
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
            className="w-full p-3 mb-4 bg-slate-800 border border-slate-600 rounded-lg focus:ring-red-500 outline-none"
          />
          <button
            disabled={!isFormValid || isLoading}
            onClick={handlePlaceBet}
            className={`w-full py-3 rounded-lg font-semibold ${
              isFormValid
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:to-red-800"
                : "bg-slate-700 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Placing..." : "Place Bet"}
          </button>
        </div>

        {/* Pending Bets */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-3">
            <div className="flex gap-2 items-center">
              <FaClock className="text-yellow-400" />
              <h3 className="text-lg font-semibold">Pending Bets</h3>
            </div>
            <button
              onClick={() => setIsPendingModalOpen(true)}
              className="text-sm text-slate-300 hover:text-white"
            >
              View All
            </button>
          </div>

          {isPendingLoading ? (
            <p className="text-slate-500">Loading…</p>
          ) : pendingBets.length > 0 ? (
            pendingBets.slice(0, 2).map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  setSelectedPendingBet(b);
                  setIsPendingModalOpen(true);
                }}
                className="cursor-pointer flex justify-between bg-slate-800/60 border border-slate-700 rounded-lg p-3 mb-2"
              >
                <div>
                  <p className="font-semibold">{b.sportBook}</p>
                  <p className="text-xs text-slate-400">Code: {b.betCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">₦{b.amount.toLocaleString()}</p>
                  <p className="text-xs text-green-400">
                    Win: ₦{b.potentialWin.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500">No pending bets</p>
          )}
        </div>

        {/* Bet History */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 mb-10">
          <div className="flex gap-2 mb-4 border-b border-slate-700 pb-3">
            <FaHistory className="text-blue-400" />
            <h3 className="text-lg font-semibold">Bet History</h3>
          </div>
          {isHistoryLoading ? (
            <p className="text-slate-500">Loading…</p>
          ) : betHistory.length ? (
            betHistory.map((b) => (
              <div
                key={b.id}
                className={`flex justify-between bg-slate-800/60 border rounded-lg p-3 mb-2 ${
                  b.status === "Won"
                    ? "border-green-600/40"
                    : b.status === "Lost"
                    ? "border-red-600/40"
                    : "border-slate-700"
                }`}
              >
                <div>
                  <p className="font-semibold">{b.sportBook}</p>
                  <p className="text-xs text-slate-400">{b.betCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">₦{b.amount.toLocaleString()}</p>
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
            <p className="text-slate-500">No history</p>
          )}
        </div>
      </div>

          {/* ✅ Beautiful Pending Bet Modal */}
          {isPendingModalOpen && selectedPendingBet && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg mx-4 my-6 p-6 relative animate-fade-in">
          
          {/* Close Button */}
          <button
            onClick={() => setIsPendingModalOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
          >
            ✕
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-3">
            <FaClock className="text-yellow-400 text-lg" />
            <h2 className="text-xl font-semibold text-white">Pending Bet Details</h2>
          </div>

          {/* Bet Info */}
          <div className="space-y-4 text-slate-300">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-slate-400">Sportbook</span>
              <span className="font-medium">{selectedPendingBet.sportBook}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-slate-400">Bet Code</span>
              <span className="font-medium">{selectedPendingBet.betCode}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-slate-400">Date Placed</span>
              <span className="font-medium">
                {new Date(selectedPendingBet.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-slate-400">Stake Amount</span>
              <span className="font-semibold text-white">
                ₦{selectedPendingBet.amount.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-slate-400">Potential Win</span>
              <span className="font-semibold text-green-400">
                ₦{selectedPendingBet.potentialWin.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-slate-400">Potential Loss</span>
              <span className="font-semibold text-red-400">
                ₦{selectedPendingBet.potentialLoss.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3">
              <span className="text-slate-400">Status</span>
              <span
                className={`font-semibold ${
                  selectedPendingBet.status === "Pending"
                    ? "text-yellow-400"
                    : selectedPendingBet.status === "Won"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {selectedPendingBet.status}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 border-t border-slate-800 pt-4 flex justify-end">
            <button
              onClick={() => setIsPendingModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 hover:text-white transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    </div>
  );
}

function DetailRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex justify-between border-b border-slate-800 pb-2">
      <span className="text-slate-400">{label}</span>
      <span className={`font-semibold ${color ?? "text-white"}`}>{value}</span>
    </div>
  );
}
