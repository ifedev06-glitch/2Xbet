"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaUserAlt, FaLock, FaBolt } from "react-icons/fa"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { loginUser } from "@/app/lib/api"
import { saveToken } from "@/app/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (!phone.trim() || !password.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await loginUser({
        phoneNumber: phone,
        password: password,
      })

      const token = response.token
      if (!token) {
        setError("Login failed: No token received")
        setIsLoading(false)
        return
      }

      saveToken(token)
      await new Promise(resolve => setTimeout(resolve, 100))
      const savedToken = localStorage.getItem("jwtToken")

      if (!savedToken) {
        setError("Failed to save authentication")
        setIsLoading(false)
        return
      }

      router.push("/dashboard")
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid phone number or password")
      } else if (err.response?.status === 404) {
        setError("Account not found")
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.code === "ECONNABORTED") {
        setError("Request timeout. Please try again.")
      } else if (err.message === "Network Error") {
        setError("Network error. Please check your connection.")
      } else {
        setError("Login failed. Please try again.")
      }
      setIsLoading(false)
    }
  }

  const isFormValid = phone.trim().length > 0 && password.trim().length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/70 border border-slate-700 rounded-2xl p-8 shadow-lg space-y-6">
        {/* Logo/Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-red-600 to-red-700 rounded-lg">
              <FaBolt className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-white">DoubleBet</h1>
          </div>
          <p className="text-slate-400 text-sm mt-2">Login to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Phone Number */}
        <div className="space-y-1">
          <label htmlFor="phone" className="block text-sm font-semibold text-white">
            Phone Number
          </label>
          <div className="relative">
            <FaUserAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="phone"
              type="text"
              placeholder="e.g. 08012345678"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                setError("")
              }}
              disabled={isLoading}
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
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              disabled={isLoading}
              className="w-full pl-10 pr-10 p-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={!isFormValid || isLoading}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            isFormValid
              ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              : "bg-slate-700 cursor-not-allowed text-slate-400"
          }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-slate-400 text-xs text-center">
          Don't have an account?{" "}
          <Link href="/register">
            <span className="text-red-400 font-semibold cursor-pointer">Sign up</span>
          </Link>
        </p>
      </div>
    </div>
  )
}
