"use client"

import { useState } from "react"
import { FaUserAlt, FaPhoneAlt, FaLock, FaBolt } from "react-icons/fa"

export default function SignupPage() {
  const [fullname, setFullname] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = () => {
    if (!fullname.trim() || !phone.trim() || !password.trim()) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert("Account created successfully ✅")
      setFullname("")
      setPhone("")
      setPassword("")
      // redirect to login or dashboard here
    }, 1500)
  }

  const isFormValid = fullname.trim() && phone.trim() && password.trim()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/70 border border-slate-700 rounded-2xl p-8 shadow-lg space-y-6">
        {/* Logo/Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-red-600 to-red-700 rounded-lg">
              <FaBolt className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-white">2XBet</h1>
          </div>
          <p className="text-slate-400 text-sm mt-2">Create your account</p>
        </div>

        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="fullname" className="block text-sm font-semibold text-white">
            Full Name
          </label>
          <div className="relative">
            <FaUserAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="fullname"
              type="text"
              placeholder="e.g. Chukwu Okafor"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full pl-10 p-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label htmlFor="phone" className="block text-sm font-semibold text-white">
            Phone Number
          </label>
          <div className="relative">
            <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="phone"
              type="text"
              placeholder="e.g. 08012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 p-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-semibold text-white">
            Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 p-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
          </div>
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          disabled={!isFormValid || isLoading}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            isFormValid
              ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              : "bg-slate-700 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Footer */}
        <p className="text-slate-400 text-xs text-center">
          Already have an account? <span className="text-red-400 font-semibold cursor-pointer">Login</span>
        </p>
      </div>
    </div>
  )
}
