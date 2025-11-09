"use client";

import { useState, useEffect } from "react";
import {
  FaBolt,
  FaArrowLeft,
  FaArrowDown,
  FaUniversity,
  FaCheckCircle,
  FaTimes,
  FaPlus,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  getProfile,
  addBankAccount,
  getUserBankAccounts,
  requestWithdrawal,
  UserProfileResponse,
  BankAccountResponse,
  BankAccountRequest,
  WithdrawRequest,
} from "@/app/lib/api";

export default function WithdrawalPage() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([]);
  const [isBankLoading, setIsBankLoading] = useState(true);

  const [withdrawAmount, setWithdrawAmount] = useState<number | "">("");
  const [selectedBankId, setSelectedBankId] = useState<number | "">("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Add bank account modal
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
  const [bankForm, setBankForm] = useState<BankAccountRequest>({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [isAddingBank, setIsAddingBank] = useState(false);

  // Success/Error modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"success" | "error">("success");

  useEffect(() => {
    async function fetchData() {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
        const accountsData = await getUserBankAccounts();
        setBankAccounts(accountsData);
      } catch (err) {
        console.error("Error loading withdrawal page:", err);
      } finally {
        setIsProfileLoading(false);
        setIsBankLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleWithdraw = async () => {
    if (withdrawAmount === "" || withdrawAmount <= 0 || selectedBankId === "") {
      setModalType("error");
      setModalMessage("Please select a bank account and enter a valid amount");
      setIsModalOpen(true);
      return;
    }

    if (withdrawAmount < 10) {
      setModalType("error");
      setModalMessage("Minimum withdrawal amount is ₦200");
      setIsModalOpen(true);
      return;
    }

    if (profile && withdrawAmount > profile.balance) {
      setModalType("error");
      setModalMessage("Insufficient balance");
      setIsModalOpen(true);
      return;
    }

    setIsWithdrawing(true);

    try {
      const req: WithdrawRequest = {
        amount: withdrawAmount as number,
        bankAccountId: selectedBankId as number,
      };

      const res = await requestWithdrawal(req);

      setModalType("success");
      setModalMessage(
        `Withdrawal request submitted successfully! Reference: #${res.id}. Your request is being processed.`
      );
      setIsModalOpen(true);

      // Reset form
      setWithdrawAmount("");
      setSelectedBankId("");

      // Refresh profile
      const profileData = await getProfile();
      setProfile(profileData);
    } catch (err: any) {
      console.error("Withdrawal failed:", err);
      setModalType("error");
      setModalMessage(
        err.response?.data?.message || "Failed to request withdrawal. Please try again."
      );
      setIsModalOpen(true);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleAddBank = async () => {
    if (!bankForm.bankName || !bankForm.accountNumber || !bankForm.accountName) {
      setModalType("error");
      setModalMessage("All fields are required");
      setIsModalOpen(true);
      return;
    }

    if (bankForm.accountNumber.length !== 10) {
      setModalType("error");
      setModalMessage("Account number must be exactly 10 digits");
      setIsModalOpen(true);
      return;
    }

    setIsAddingBank(true);

    try {
      const newAccount = await addBankAccount(bankForm);
      setBankAccounts([...bankAccounts, newAccount]);

      setModalType("success");
      setModalMessage("Bank account added successfully!");
      setIsModalOpen(true);

      // Reset form and close modal
      setBankForm({ bankName: "", accountNumber: "", accountName: "" });
      setIsAddBankModalOpen(false);
    } catch (err: any) {
      console.error("Add bank failed:", err);
      setModalType("error");
      setModalMessage(
        err.response?.data?.message || "Failed to add bank account. Please try again."
      );
      setIsModalOpen(true);
    } finally {
      setIsAddingBank(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalMessage(null);
  };

  const handleBack = () => {
    window.history.back();
  };

  const isWithdrawFormValid =
    withdrawAmount !== "" && withdrawAmount > 0 && selectedBankId !== "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 text-white">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition font-semibold text-sm"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-red-600 to-red-700 rounded-lg">
              <FaBolt className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">DoubleBet</h1>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-orange-900/30 to-slate-900/50 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs mb-1">Available Balance</p>
              <h2 className="text-3xl font-bold text-orange-400">
                ₦{isProfileLoading ? "..." : (profile?.balance ?? 0).toLocaleString()}
              </h2>
            </div>
            <div className="p-4 bg-orange-600/20 rounded-full border border-orange-600/30">
              <FaArrowDown className="text-orange-500 w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold border-b border-slate-700 pb-4 mb-6">
            Request Withdrawal
          </h3>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 flex gap-3 mb-6">
            <FaExclamationTriangle className="text-orange-500 w-5 h-5 mt-1" />
            <p className="text-slate-300 text-sm">
              Withdrawals are processed manually within <span className="font-semibold">1 hour</span>.
              Minimum withdrawal: <span className="font-semibold">₦200</span>
            </p>
          </div>

          <div className="space-y-6">
            {/* Bank Account Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="bankAccount" className="block text-sm font-semibold">
                  Select Bank Account
                </label>
                <button
                  onClick={() => setIsAddBankModalOpen(true)}
                  className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition"
                >
                  <FaPlus className="w-3 h-3" />
                  Add New
                </button>
              </div>

              {isBankLoading ? (
                <div className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 text-slate-500">
                  Loading bank accounts...
                </div>
              ) : bankAccounts.length > 0 ? (
                <select
                  id="bankAccount"
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(Number(e.target.value))}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-white"
                >
                  <option value="">Choose bank account...</option>
                  {bankAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.bankName} - {account.accountNumber} ({account.accountName})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-center py-8 bg-slate-800/40 rounded-lg border-2 border-dashed border-slate-600">
                  <FaUniversity className="mx-auto text-slate-500 w-12 h-12 mb-3" />
                  <p className="text-slate-400 mb-4">No bank accounts added yet</p>
                  <button
                    onClick={() => setIsAddBankModalOpen(true)}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold text-sm transition"
                  >
                    + Add Bank Account
                  </button>
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-sm font-semibold mb-2">
                Withdrawal Amount (₦)
              </label>
              <input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  setWithdrawAmount(val === "" ? "" : Number(val));
                }}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none placeholder:text-slate-500 text-white"
              />
              <p className="text-xs text-slate-400 mt-1">
                Minimum: ₦1,000 • Available: ₦{(profile?.balance ?? 0).toLocaleString()}
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleWithdraw}
              disabled={!isWithdrawFormValid || isWithdrawing || bankAccounts.length === 0}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                isWithdrawFormValid && !isWithdrawing && bankAccounts.length > 0
                  ? "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                  : "bg-slate-700 cursor-not-allowed"
              }`}
            >
              {isWithdrawing ? "Processing..." : "Request Withdrawal"}
            </button>
          </div>
        </div>

        {/* Bank Accounts List */}
        {bankAccounts.length > 0 && (
          <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-3">
              <FaUniversity className="text-blue-400" />
              <h3 className="text-lg font-semibold">Your Bank Accounts</h3>
            </div>

            <div className="space-y-3">
              {bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex justify-between items-center bg-slate-800/60 border border-slate-700 rounded-lg p-4"
                >
                  <div>
                    <p className="font-semibold text-white">{account.bankName}</p>
                    <p className="text-sm text-slate-400">{account.accountNumber}</p>
                    <p className="text-sm text-slate-400">{account.accountName}</p>
                  </div>
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <FaUniversity className="text-blue-400 w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Bank Account Modal */}
      {isAddBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-xl text-white relative">
            <button
              onClick={() => setIsAddBankModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaPlus className="text-green-400" /> Add Bank Account
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="bankName" className="block text-sm font-semibold mb-2">
                  Bank Name
                </label>
                <input
                  id="bankName"
                  type="text"
                  placeholder="e.g., GTBank, Access Bank"
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-white placeholder:text-slate-500"
                />
              </div>

              <div>
                <label htmlFor="accountNumber" className="block text-sm font-semibold mb-2">
                  Account Number
                </label>
                <input
                  id="accountNumber"
                  type="text"
                  placeholder="10-digit account number"
                  value={bankForm.accountNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setBankForm({ ...bankForm, accountNumber: value });
                    }
                  }}
                  maxLength={10}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-white placeholder:text-slate-500"
                />
              </div>

              <div>
                <label htmlFor="accountName" className="block text-sm font-semibold mb-2">
                  Account Name
                </label>
                <input
                  id="accountName"
                  type="text"
                  placeholder="Account holder name"
                  value={bankForm.accountName}
                  onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-white placeholder:text-slate-500"
                />
              </div>

              <button
                onClick={handleAddBank}
                disabled={isAddingBank}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  !isAddingBank
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    : "bg-slate-700 cursor-not-allowed"
                }`}
              >
                {isAddingBank ? "Adding..." : "Add Bank Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-slate-900 rounded-2xl p-8 shadow-lg w-11/12 max-w-md text-center text-white">
            {modalType === "success" ? (
              <FaCheckCircle className="mx-auto text-green-400 w-14 h-14 mb-4" />
            ) : (
              <FaTimes className="mx-auto text-red-400 w-14 h-14 mb-4" />
            )}
            <p className="text-lg mb-4">{modalMessage}</p>
            <button
              onClick={handleModalClose}
              className={`px-6 py-3 rounded-lg font-semibold ${
                modalType === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}