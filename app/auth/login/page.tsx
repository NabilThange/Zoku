"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, ArrowLeft, Mail, Phone } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginType, setLoginType] = useState<"email" | "phone">("email")
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt:", formData)
    window.location.href = "/app"
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#FFF4F0" }}>
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => (window.location.href = "/")}
          className="mb-6 flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
          style={{
            backgroundColor: "#FFE5DB",
            color: "#D97706",
            border: "2px solid #FF6B35",
            boxShadow: "2px 2px #FF6B35",
          }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        {/* Login Form Card */}
        <div
          className="p-8 rounded-xl transition-all duration-200"
          style={{
            backgroundColor: "#FFE5DB",
            border: "2px solid #FF6B35",
            boxShadow: "4px 4px #FF6B35",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                backgroundColor: "#FFF4F0",
                border: "2px solid #FF6B35",
                boxShadow: "2px 2px #FF6B35",
              }}
            >
              <span className="text-3xl font-bold" style={{ color: "#FF6B35" }}>
                C
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#2D3748" }}>
              Welcome Back
            </h1>
            <p className="text-lg font-medium" style={{ color: "#D97706" }}>
              Sign in to continue
            </p>
          </div>

          <div className="space-y-6">
            {/* OAuth Buttons */}
            <button
              type="button"
              className="w-full h-12 flex items-center justify-center gap-3 font-medium text-base rounded-xl transition-all duration-200 hover:shadow-lg hover:translate-y-[-1px] relative overflow-hidden"
              style={{
                backgroundColor: "#FFF4F0",
                color: "#2D3748",
                border: "2px solid #FF6B35",
                boxShadow: "2px 2px #FF6B35",
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            {/* Separator */}
            <div className="flex items-center justify-center gap-4 my-6">
              <div className="h-1 w-20 rounded-full" style={{ backgroundColor: "#D97706" }} />
              <span className="font-medium text-lg" style={{ color: "#2D3748" }}>
                OR
              </span>
              <div className="h-1 w-20 rounded-full" style={{ backgroundColor: "#D97706" }} />
            </div>

            {/* Toggle Buttons for Email/Phone Selection */}
            <div
              className="flex rounded-xl p-1"
              style={{ backgroundColor: "#FFF4F0", border: "2px solid #FF6B35", boxShadow: "2px 2px #FF6B35" }}
            >
              <button
                type="button"
                onClick={() => setLoginType("email")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  loginType === "email" ? "shadow-md" : ""
                }`}
                style={{
                  backgroundColor: loginType === "email" ? "#FF6B35" : "transparent",
                  color: loginType === "email" ? "white" : "#2D3748",
                }}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginType("phone")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  loginType === "phone" ? "shadow-md" : ""
                }`}
                style={{
                  backgroundColor: loginType === "phone" ? "#FF6B35" : "transparent",
                  color: loginType === "phone" ? "white" : "#2D3748",
                }}
              >
                <Phone className="w-4 h-4" />
                Phone
              </button>
            </div>

            {/* Updated Input Field to Switch Between Email and Phone */}
            <div className="space-y-2">
              <label htmlFor={loginType} className="text-sm font-medium" style={{ color: "#2D3748" }}>
                {loginType === "email" ? "Email Address" : "Phone Number"}
              </label>
              <input
                id={loginType}
                name={loginType}
                type={loginType === "email" ? "email" : "tel"}
                placeholder={loginType === "email" ? "Enter your email" : "Enter your phone number"}
                value={loginType === "email" ? formData.email : formData.phone}
                onChange={handleInputChange}
                required
                className="w-full h-12 px-4 text-base font-medium rounded-xl transition-all duration-200 focus:outline-none focus:shadow-lg"
                style={{
                  backgroundColor: "#FFF4F0",
                  color: "#2D3748",
                  border: "2px solid #FF6B35",
                  boxShadow: "2px 2px #FF6B35",
                }}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium" style={{ color: "#2D3748" }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-4 pr-12 text-base font-medium rounded-xl transition-all duration-200 focus:outline-none focus:shadow-lg"
                  style={{
                    backgroundColor: "#FFF4F0",
                    color: "#2D3748",
                    border: "2px solid #FF6B35",
                    boxShadow: "2px 2px #FF6B35",
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors"
                  style={{ color: "#D97706" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm font-medium underline transition-all duration-200 hover:no-underline"
                style={{ color: "#FF6B35" }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full h-12 text-lg font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:translate-y-[-1px] relative overflow-hidden group"
              style={{
                backgroundColor: "#FF6B35",
                color: "white",
                border: "2px solid #2D3748",
                boxShadow: "2px 2px #2D3748",
              }}
            >
              <span className="relative z-10">Sign In</span>
              <div
                className="absolute inset-0 w-0 transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: "#E55A2B" }}
              />
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 my-8">
            <div className="h-1 w-16 rounded-full" style={{ backgroundColor: "#D97706" }} />
            <span className="font-medium text-sm" style={{ color: "#D97706" }}>
              or
            </span>
            <div className="h-1 w-16 rounded-full" style={{ backgroundColor: "#D97706" }} />
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-base font-medium" style={{ color: "#2D3748" }}>
              Don't have an account?{" "}
              <button
                type="button"
                className="font-semibold underline transition-all duration-200 hover:no-underline"
                style={{ color: "#FF6B35" }}
                onClick={() => (window.location.href = "/auth/register")}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
