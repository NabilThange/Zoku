"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, ArrowLeft, Mail, Phone } from "lucide-react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signupType, setSignupType] = useState<"email" | "phone">("email")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }

    console.log("Registration attempt:", formData)
    window.location.href = "/app"
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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

        {/* Register Form Card */}
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
              Create Account
            </h1>
            <p className="text-lg font-medium" style={{ color: "#D97706" }}>
              Join Cantio and start ordering
            </p>
          </div>

          <div className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium" style={{ color: "#2D3748" }}>
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
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

            {/* Email/Phone Selection */}
            <div
              className="flex rounded-xl p-1"
              style={{ backgroundColor: "#FFF4F0", border: "2px solid #FF6B35", boxShadow: "2px 2px #FF6B35" }}
            >
              <button
                type="button"
                onClick={() => setSignupType("email")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  signupType === "email" ? "shadow-md" : ""
                }`}
                style={{
                  backgroundColor: signupType === "email" ? "#FF6B35" : "transparent",
                  color: signupType === "email" ? "white" : "#2D3748",
                }}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setSignupType("phone")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  signupType === "phone" ? "shadow-md" : ""
                }`}
                style={{
                  backgroundColor: signupType === "phone" ? "#FF6B35" : "transparent",
                  color: signupType === "phone" ? "white" : "#2D3748",
                }}
              >
                <Phone className="w-4 h-4" />
                Phone
              </button>
            </div>

            {/* Email/Phone Input */}
            <div className="space-y-2">
              <label htmlFor={signupType} className="text-sm font-medium" style={{ color: "#2D3748" }}>
                {signupType === "email" ? "Email Address" : "Phone Number"}
              </label>
              <input
                id={signupType}
                name={signupType}
                type={signupType === "email" ? "email" : "tel"}
                placeholder={signupType === "email" ? "Enter your email" : "Enter your phone number"}
                value={signupType === "email" ? formData.email : formData.phone}
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

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium" style={{ color: "#2D3748" }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium" style={{ color: "#2D3748" }}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 pt-2">
              <div className="relative">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div
                  className="w-6 h-6 rounded border-2 cursor-pointer flex items-center justify-center transition-all duration-200"
                  style={{
                    backgroundColor: formData.agreeToTerms ? "#FF6B35" : "#FFF4F0",
                    borderColor: "#FF6B35",
                    boxShadow: "1px 1px #FF6B35",
                  }}
                  onClick={() => setFormData({ ...formData, agreeToTerms: !formData.agreeToTerms })}
                >
                  {formData.agreeToTerms && (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </div>
              </div>
              <label
                htmlFor="agreeToTerms"
                className="text-sm leading-relaxed cursor-pointer font-medium"
                style={{ color: "#2D3748" }}
                onClick={() => setFormData({ ...formData, agreeToTerms: !formData.agreeToTerms })}
              >
                I agree to the{" "}
                <span
                  className="font-semibold underline transition-all duration-200 hover:no-underline"
                  style={{ color: "#FF6B35" }}
                >
                  Terms and Conditions
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full h-12 text-lg font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:translate-y-[-1px] relative overflow-hidden group mt-6"
              style={{
                backgroundColor: "#FF6B35",
                color: "white",
                border: "2px solid #2D3748",
                boxShadow: "2px 2px #2D3748",
              }}
            >
              <span className="relative z-10">Create Account</span>
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

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-base font-medium" style={{ color: "#2D3748" }}>
              Already have an account?{" "}
              <button
                type="button"
                className="font-semibold underline transition-all duration-200 hover:no-underline"
                style={{ color: "#FF6B35" }}
                onClick={() => (window.location.href = "/auth/login")}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
