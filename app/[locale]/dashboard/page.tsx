"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Video,
  Receipt,
  FileText,
  Lock,
  Bell,
  Award,
  Calendar,
  TrendingUp,
  Upload,
  Eye,
  Edit,
  Check,
  X,
  Download,
  Play,
  Clock,
  Target,
  Activity,
  Heart,
  Zap,
  ChevronRight,
  Camera,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type TabType = "overview" | "videos" | "payments" | "health" | "account" | "progress"

// Mock data
const mockUser = {
  name: "Morvarid Haji",
  email: "morvaridfitness@gmail.com",
  phone: "+971 (58) 849-8855",
  avatar: "/avatar.jpg",
  memberSince: "December 2025",
  planStatus: "Active",
  nextPayment: "April 15, 2024",
}

const mockVideos = [
  {
    id: 1,
    title: "Full Body Strength Training",
    duration: "45 min",
    level: "Intermediate",
    thumbnail: "/thumb1.jpg",
    assignedDate: "Mar 10, 2024",
    completed: true,
  },
  {
    id: 2,
    title: "HIIT Cardio Blast",
    duration: "30 min",
    level: "Advanced",
    thumbnail: "/thumb2.jpg",
    assignedDate: "Mar 12, 2024",
    completed: false,
  },
  {
    id: 3,
    title: "Core & Abs Workout",
    duration: "25 min",
    level: "Beginner",
    thumbnail: "/thumb3.jpg",
    assignedDate: "Mar 15, 2024",
    completed: false,
  },
]

const mockPayments = [
  {
    id: 1,
    amount: "$150",
    date: "Mar 1, 2024",
    status: "approved",
    method: "Bank Transfer",
    receiptUrl: "#",
  },
  {
    id: 2,
    amount: "$150",
    date: "Feb 1, 2024",
    status: "approved",
    method: "Bank Transfer",
    receiptUrl: "#",
  },
  {
    id: 3,
    amount: "$150",
    date: "Jan 1, 2024",
    status: "approved",
    method: "Bank Transfer",
    receiptUrl: "#",
  },
]

const mockHealthData = {
  height: "165 cm",
  weight: "60 kg",
  age: "28",
  goal: "Weight Loss & Toning",
  fitnessLevel: "Intermediate",
  medicalConditions: "None",
  dietaryPreferences: "Vegetarian",
  workoutFrequency: "4-5 times per week",
  lastUpdated: "Jan 15, 2024",
}

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [isEditingHealth, setIsEditingHealth] = useState(false)
  const [isEditingAccount, setIsEditingAccount] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [uploadingReceipt, setUploadingReceipt] = useState(false)

  const navigation = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "videos", label: "My Workouts", icon: Video },
    { id: "payments", label: "Payments", icon: Receipt },
    { id: "health", label: "Health Profile", icon: FileText },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "account", label: "Account", icon: User },
  ]

  const stats = [
    { label: "Workouts Completed", value: "24", icon: Check, color: "from-rose-500 to-pink-500" },
    { label: "Total Hours", value: "18.5", icon: Clock, color: "from-purple-500 to-indigo-500" },
    { label: "Current Streak", value: "7 days", icon: Zap, color: "from-orange-500 to-yellow-500" },
    {
      label: "Calories Burned",
      value: "2,840",
      icon: Target,
      color: "from-green-500 to-emerald-500",
    },
  ]

  const handleUploadReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    setUploadingReceipt(true)
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    setUploadingReceipt(false)
    alert("Receipt uploaded successfully! Awaiting admin approval.")
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-rose-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                className="object-contain h-25 w-auto"
                width={250}
                height={100}
                src="/morvafit-logo.svg"
                alt="Morvafit Logo"
              />
            </Link>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-xl border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all duration-300">
                <Bell size={20} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{mockUser.name}</p>
                  <p className="text-xs text-gray-500">{mockUser.planStatus} Plan</p>
                </div>
                <div className="relative group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    SJ
                  </div>
                  <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-4 sticky top-24"
            >
              <nav className="space-y-1">
                {navigation.map(item => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as TabType)}
                      whileHover={{ x: 4 }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={20} />
                      {item.label}
                    </motion.button>
                  )
                })}
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-900">{mockUser.memberSince}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Next Payment</span>
                  <span className="font-medium text-gray-900">{mockUser.nextPayment}</span>
                </div>
              </div>
            </motion.div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Welcome Banner */}
                    <div className="bg-linear-to-r from-rose-500 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2">
                          Welcome back, {mockUser.name.split(" ")[0]}! 👋
                        </h1>
                        <p className="text-white/90">
                          You're doing amazing! Keep up the great work.
                        </p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {stats.map((stat, i) => {
                        const Icon = stat.icon
                        return (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
                          >
                            <div
                              className={`w-12 h-12 rounded-xl bg-linear-to-r ${stat.color} flex items-center justify-center mb-4`}
                            >
                              <Icon size={24} className="text-white" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                          </motion.div>
                        )
                      })}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                            <Video className="text-rose-600" size={20} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Continue Your Journey</h3>
                            <p className="text-sm text-gray-600">2 new workouts assigned</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab("videos")}
                          className="w-full py-3 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
                        >
                          View Workouts
                        </button>
                      </div>

                      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Receipt className="text-purple-600" size={20} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Payment Due Soon</h3>
                            <p className="text-sm text-gray-600">
                              Next payment: {mockUser.nextPayment}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab("payments")}
                          className="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:border-rose-300 hover:bg-rose-50 transition-all duration-300"
                        >
                          Make Payment
                        </button>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Workouts</h3>
                      <div className="space-y-3">
                        {mockVideos.slice(0, 3).map(video => (
                          <div
                            key={video.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-lg bg-linear-to-br from-rose-400 to-pink-400 flex items-center justify-center">
                                <Play className="text-white" size={24} />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{video.title}</p>
                                <p className="text-sm text-gray-600">
                                  {video.duration} • {video.level}
                                </p>
                              </div>
                            </div>
                            {video.completed && (
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="text-green-600" size={16} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Videos Tab */}
                {activeTab === "videos" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">My Workouts</h2>
                        <p className="text-gray-600 mt-1">Your personalized workout plan</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="text-rose-500" size={20} />
                        <span className="text-gray-600">1 of 3 completed</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mockVideos.map((video, i) => (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                        >
                          <div className="relative aspect-video bg-linear-to-br from-gray-200 to-gray-300">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-xl flex items-center justify-center shadow-lg group-hover:bg-linear-to-r group-hover:from-rose-500 group-hover:to-pink-500 transition-all duration-300"
                              >
                                <Play
                                  className="text-gray-900 group-hover:text-white ml-1"
                                  size={24}
                                />
                              </motion.button>
                            </div>
                            {video.completed && (
                              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-medium flex items-center gap-1">
                                <Check size={14} />
                                Completed
                              </div>
                            )}
                            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                              {video.duration}
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {video.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                              <span className="flex items-center gap-1">
                                <Activity size={16} />
                                {video.level}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={16} />
                                Assigned {video.assignedDate}
                              </span>
                            </div>
                            <button className="w-full py-3 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300">
                              {video.completed ? "Watch Again" : "Start Workout"}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payments Tab */}
                {activeTab === "payments" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">Payments</h2>
                      <p className="text-gray-600 mt-1">
                        Manage your payment history and upload receipts
                      </p>
                    </div>

                    {/* Upload Receipt */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Upload Payment Receipt
                      </h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-rose-400 transition-colors">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleUploadReceipt}
                            className="hidden"
                            disabled={uploadingReceipt}
                          />
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
                              {uploadingReceipt ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full"
                                />
                              ) : (
                                <Upload className="text-rose-600" size={24} />
                              )}
                            </div>
                            <div>
                              <p className="text-lg font-medium text-gray-900">
                                {uploadingReceipt ? "Uploading..." : "Click to upload receipt"}
                              </p>
                              <p className="text-sm text-gray-600">PNG, JPG or PDF (max. 5MB)</p>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Payment History */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 overflow-hidden">
                      <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {mockPayments.map(payment => (
                          <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                  <Check className="text-green-600" size={20} />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{payment.amount}</p>
                                  <p className="text-sm text-gray-600">
                                    {payment.date} • {payment.method}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium capitalize">
                                  {payment.status}
                                </span>
                                <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                  <Download size={16} className="text-gray-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Health Profile Tab */}
                {activeTab === "health" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">Health Profile</h2>
                        <p className="text-gray-600 mt-1">
                          Your body metrics and fitness information
                        </p>
                      </div>
                      <button
                        onClick={() => setIsEditingHealth(!isEditingHealth)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:border-rose-300 hover:bg-rose-50 transition-all duration-300"
                      >
                        {isEditingHealth ? <X size={18} /> : <Edit size={18} />}
                        {isEditingHealth ? "Cancel" : "Edit"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Height</h3>
                        {isEditingHealth ? (
                          <input
                            type="text"
                            defaultValue={mockHealthData.height}
                            className="text-2xl font-bold text-gray-900 bg-gray-50 rounded-lg px-3 py-2 w-full"
                          />
                        ) : (
                          <p className="text-2xl font-bold text-gray-900">
                            {mockHealthData.height}
                          </p>
                        )}
                      </div>

                      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Weight</h3>
                        {isEditingHealth ? (
                          <input
                            type="text"
                            defaultValue={mockHealthData.weight}
                            className="text-2xl font-bold text-gray-900 bg-gray-50 rounded-lg px-3 py-2 w-full"
                          />
                        ) : (
                          <p className="text-2xl font-bold text-gray-900">
                            {mockHealthData.weight}
                          </p>
                        )}
                      </div>

                      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Age</h3>
                        {isEditingHealth ? (
                          <input
                            type="text"
                            defaultValue={mockHealthData.age}
                            className="text-2xl font-bold text-gray-900 bg-gray-50 rounded-lg px-3 py-2 w-full"
                          />
                        ) : (
                          <p className="text-2xl font-bold text-gray-900">
                            {mockHealthData.age} years
                          </p>
                        )}
                      </div>

                      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Fitness Level</h3>
                        {isEditingHealth ? (
                          <select className="text-2xl font-bold text-gray-900 bg-gray-50 rounded-lg px-3 py-2 w-full">
                            <option>Beginner</option>
                            <option selected>Intermediate</option>
                            <option>Advanced</option>
                          </select>
                        ) : (
                          <p className="text-2xl font-bold text-gray-900">
                            {mockHealthData.fitnessLevel}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-600 mb-2">Fitness Goal</h3>
                          {isEditingHealth ? (
                            <input
                              type="text"
                              defaultValue={mockHealthData.goal}
                              className="text-lg text-gray-900 bg-gray-50 rounded-lg px-3 py-2 w-full"
                            />
                          ) : (
                            <p className="text-lg text-gray-900">{mockHealthData.goal}</p>
                          )}
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-600 mb-2">
                            Workout Frequency
                          </h3>
                          {isEditingHealth ? (
                            <input
                              type="text"
                              defaultValue={mockHealthData.workoutFrequency}
                              className="text-lg text-gray-900 bg-gray-50 rounded-lg px-3 py-2 w-full"
                            />
                          ) : (
                            <p className="text-lg text-gray-900">
                              {mockHealthData.workoutFrequency}
                            </p>
                          )}
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-600 mb-2">
                            Dietary Preferences
                          </h3>
                          {isEditingHealth ? (
                            <input
                              type="text"
                              defaultValue={mockHealthData.dietaryPreferences}
                              className="text-lg text-gray-900 bg-gray-50 rounded-lg px-3 py-2 w-full"
                            />
                          ) : (
                            <p className="text-lg text-gray-900">
                              {mockHealthData.dietaryPreferences}
                            </p>
                          )}
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-600 mb-2">
                            Medical Conditions
                          </h3>
                          {isEditingHealth ? (
                            <textarea
                              defaultValue={mockHealthData.medicalConditions}
                              rows={3}
                              className="text-lg text-gray-900 bg-gray-50 rounded-lg px-3 py-2 w-full"
                            />
                          ) : (
                            <p className="text-lg text-gray-900">
                              {mockHealthData.medicalConditions}
                            </p>
                          )}
                        </div>
                      </div>

                      {isEditingHealth && (
                        <div className="mt-6 flex gap-3">
                          <button className="flex-1 py-3 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300">
                            Save Changes
                          </button>
                          <button
                            onClick={() => setIsEditingHealth(false)}
                            className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      <p className="text-sm text-gray-500 mt-4">
                        Last updated: {mockHealthData.lastUpdated}
                      </p>
                    </div>
                  </div>
                )}

                {/* Progress Tab */}
                {activeTab === "progress" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">My Progress</h2>
                      <p className="text-gray-600 mt-1">Track your fitness journey</p>
                    </div>

                    <div className="bg-linear-to-r from-rose-500 to-pink-500 rounded-2xl p-8 text-white">
                      <h3 className="text-2xl font-bold mb-2">Keep Going! 🔥</h3>
                      <p className="text-white/90 mb-6">
                        You've completed 24 workouts. That's amazing progress!
                      </p>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-white h-full rounded-full"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                      <p className="text-sm text-white/80 mt-2">65% toward your monthly goal</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                          <Heart className="text-rose-600" size={28} />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">-5 kg</p>
                        <p className="text-sm text-gray-600">Weight Lost</p>
                      </div>

                      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                          <TrendingUp className="text-purple-600" size={28} />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">+8%</p>
                        <p className="text-sm text-gray-600">Strength Gain</p>
                      </div>

                      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                          <Zap className="text-green-600" size={28} />
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">92%</p>
                        <p className="text-sm text-gray-600">Consistency</p>
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Photos</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                          <div
                            key={i}
                            className="aspect-square rounded-xl bg-gray-200 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity group relative overflow-hidden"
                          >
                            <Camera
                              className="text-gray-400 group-hover:scale-110 transition-transform"
                              size={32}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 font-medium hover:border-rose-400 hover:text-rose-600 transition-all duration-300">
                        + Upload Progress Photo
                      </button>
                    </div>
                  </div>
                )}

                {/* Account Tab */}
                {activeTab === "account" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">Account Settings</h2>
                        <p className="text-gray-600 mt-1">Manage your personal information</p>
                      </div>
                      {!isEditingAccount && (
                        <button
                          onClick={() => setIsEditingAccount(true)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:border-rose-300 hover:bg-rose-50 transition-all duration-300"
                        >
                          <Edit size={18} />
                          Edit Profile
                        </button>
                      )}
                    </div>

                    {/* Profile Picture */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
                      <div className="flex items-center gap-6">
                        <div className="relative group">
                          <div className="w-24 h-24 rounded-full bg-linear-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                            SJ
                          </div>
                          <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" size={24} />
                          </button>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Upload a new profile picture</p>
                          <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors">
                            Choose File
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Personal Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          {isEditingAccount ? (
                            <input
                              type="text"
                              defaultValue={mockUser.name}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300"
                            />
                          ) : (
                            <p className="text-lg text-gray-900">{mockUser.name}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          {isEditingAccount ? (
                            <input
                              type="email"
                              defaultValue={mockUser.email}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300"
                            />
                          ) : (
                            <p className="text-lg text-gray-900">{mockUser.email}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          {isEditingAccount ? (
                            <input
                              type="tel"
                              defaultValue={mockUser.phone}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300"
                            />
                          ) : (
                            <p className="text-lg text-gray-900">{mockUser.phone}</p>
                          )}
                        </div>
                      </div>

                      {isEditingAccount && (
                        <div className="mt-6 flex gap-3">
                          <button className="flex-1 py-3 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300">
                            Save Changes
                          </button>
                          <button
                            onClick={() => setIsEditingAccount(false)}
                            className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Security */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                              <Lock className="text-purple-600" size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Password</p>
                              <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowPasswordModal(true)}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-white transition-colors"
                          >
                            Change
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                              <Check className="text-green-600" size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                              <p className="text-sm text-gray-600">
                                Extra security for your account
                              </p>
                            </div>
                          </div>
                          <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-white transition-colors">
                            Enable
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-red-200 p-6">
                      <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                      <div className="space-y-3">
                        <button className="w-full py-3 rounded-xl border-2 border-red-200 text-red-600 font-medium hover:bg-red-50 transition-all duration-300">
                          Pause Membership
                        </button>
                        <button className="w-full py-3 rounded-xl border-2 border-red-200 text-red-600 font-medium hover:bg-red-50 transition-all duration-300">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 z-50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Change Password</h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 py-3 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300">
                  Update Password
                </button>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserDashboard
