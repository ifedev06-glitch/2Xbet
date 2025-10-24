"use client"

import { useState } from "react"
import { FaBolt, FaUserAlt, FaArrowUp, FaArrowDown, FaExclamationTriangle, FaClock, FaHistory } from "react-icons/fa"

export default function BettingDashboard() {
  const [betCode, setBetCode] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [balance] = useState(50000)

  // Temporary data (you’ll replace with API calls later)
  const [pendingBets] = useState([
    { id: 1, code: "X7J89K", amount: 1000, odds: 3.5, company: "Bet365", date: "2025-10-23" },
    { id: 2, code: "A4T11Z", amount: 2000, odds: 2.8, company: "DraftKings", date: "2025-10-22" },
  ])

  const [betHistory] = useState([
  {
    id: 1,
    code: "B8Q71L",
    amount: 1500,
    status: "Won",
    company: "SportyBet",
    potentialWin: 1500 * 2,
    potentialLoss: 1500 / 2,
    date: "2025-10-20",
  },
  {
    id: 2,
    code: "Z9U12D",
    amount: 2500,
    status: "Lost",
    company: "BetKing",
    potentialWin: 2500 * 2,
    potentialLoss: 2500 / 2,
    date: "2025-10-18",
  },
]);


 const BET_COMPANIES = [
  { id: "sportybet", name: "SportyBet" },
  { id: "betking", name: "BetKing" },
  { id: "betano", name: "Betano" },
  { id: "bet9ja", name: "Bet9ja" },
  { id: "paripesa", name: "Paripesa" },
  { id: "1xbet", name: "1XBet" },
]


  const handlePlaceBet = () => {
    if (!betCode.trim() || !selectedCompany) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setBetCode("")
      setSelectedCompany("")
      alert("Bet placed successfully ✅")
    }, 1500)
  }

  const isFormValid = betCode.trim().length > 0 && selectedCompany
  const selectedCompanyData = BET_COMPANIES.find((c) => c.id === selectedCompany)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-red-600 to-red-700 rounded-lg">
              <FaBolt className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold">2XBet</h1>
          </div>
          <p className="text-slate-400 text-sm">Your Ultimate Sports Betting Hub</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-r from-red-900/30 to-slate-900/50 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-600/20 rounded-full border border-red-600/30">
                <FaUserAlt className="text-red-500 w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Welcome back</p>
                <h2 className="font-bold text-lg">Chukwu Okafor</h2>
                <p className="text-red-400 font-semibold text-base">
                  ₦{balance.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-sm flex items-center gap-2 transition">
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
  <h3 className="text-xl font-semibold border-b border-slate-700 pb-4 mb-6">
    Place Your Bet
  </h3>

  {/* ⚠️ Win/Lose Info */}
  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3 mb-6">
    <FaExclamationTriangle className="text-red-500 w-5 h-5 mt-1" />
    <p className="text-slate-300 text-sm">
      Remember: <span className="font-semibold text-green-400">You Win → double your stake</span> 
      , <span className="font-semibold text-orange-400">You Lose → we return half your stake</span>.
    </p>
  </div>

  <div className="space-y-6">
    {/* Bet Code */}
    <div>
      <label htmlFor="betcode" className="block text-sm font-semibold mb-2">
        Bet Code
      </label>
      <input
        id="betcode"
        type="text"
        placeholder="Enter your bet code"
        value={betCode}
        onChange={(e) => setBetCode(e.target.value)}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none placeholder:text-slate-500 text-white"
      />
    </div>

    {/* Company */}
    <div>
      <label htmlFor="company" className="block text-sm font-semibold mb-2">
        Sportsbook
      </label>
      <select
        id="company"
        value={selectedCompany}
        onChange={(e) => setSelectedCompany(e.target.value)}
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-white"
      >
        <option value="">Choose sportsbook</option>
        {BET_COMPANIES.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
    </div>

    {/* Company Notice */}
    {selectedCompanyData && (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
        <FaExclamationTriangle className="text-red-500 w-5 h-5 mt-1" />
        <div className="text-slate-300 text-sm">
          <p className="font-semibold text-red-400 mb-1">{selectedCompanyData.name}</p>
          <p>Your bet will be placed on this sportsbook. Ensure your account is active.</p>
        </div>
      </div>
    )}

    {/* Submit */}
    <button
      onClick={handlePlaceBet}
      disabled={!isFormValid || isLoading}
      className={`w-full py-3 rounded-lg font-semibold transition ${
        isFormValid
          ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          : "bg-slate-700 cursor-not-allowed"
      }`}
    >
      {isLoading ? "Placing Bet..." : "Place Bet"}
    </button>
  </div>
</div>


{/* Pending Bets */}
<div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 shadow-lg">
  <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-3">
    <FaClock className="text-yellow-400" />
    <h3 className="text-lg font-semibold">Pending Bets</h3>
  </div>

  {pendingBets.length > 0 ? (
    <div className="space-y-3">
      {pendingBets.map((bet) => {
        const potentialWin = bet.amount * 2
        const potentialLoss = bet.amount / 2

        return (
          <div
            key={bet.id}
            className="flex justify-between items-center bg-slate-800/60 border border-slate-700 rounded-lg p-3"
          >
            <div>
              <p className="font-semibold">{bet.company}</p>
              <p className="text-xs text-slate-400">
                Code: {bet.code} • {bet.date}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-300">₦{bet.amount.toLocaleString()}</p>
              <p className="text-xs text-green-400">Potential Win: ₦{potentialWin.toLocaleString()}</p>
              <p className="text-xs text-red-400">Potential Loss: ₦{potentialLoss.toLocaleString()}</p>
            </div>
          </div>
        )
      })}
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

          {betHistory.length > 0 ? (
            <div className="space-y-3">
              {betHistory.map((bet) => (
                <div
                  key={bet.id}
                  className={`flex justify-between items-center bg-slate-800/60 border rounded-lg p-3 ${
                    bet.status === "Won"
                      ? "border-green-600/40"
                      : "border-red-600/40"
                  }`}
                >
                  <div>
                    <p className="font-semibold">{bet.company}</p>
                    <p className="text-xs text-slate-400">
                      Code: {bet.code} • {bet.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-300">₦{bet.amount.toLocaleString()}</p>
                    <p
                      className={`text-xs font-semibold ${
                        bet.status === "Won" ? "text-green-400" : "text-red-400"
                      }`}
                    >
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
    </div>
  )
}
