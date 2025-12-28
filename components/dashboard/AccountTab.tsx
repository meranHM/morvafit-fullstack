"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Edit, Camera, Lock, X } from "lucide-react"

interface AccountTabProps {
  name: string
  email: string
  phone: string
}

const AccountTab: React.FC<AccountTabProps> = ({ name, email, phone }) => {
  const [isEditingAccount, setIsEditingAccount] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditingAccount ? (
                    <input
                      type="text"
                      defaultValue={name}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300"
                    />
                  ) : (
                    <p className="text-lg text-gray-900">{name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditingAccount ? (
                    <input
                      type="email"
                      defaultValue={email}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300"
                    />
                  ) : (
                    <p className="text-lg text-gray-900">{email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditingAccount ? (
                    <input
                      type="tel"
                      defaultValue={phone}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300"
                    />
                  ) : (
                    <p className="text-lg text-gray-900">{phone}</p>
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
                    // onClick={() => setShowPasswordModal(true)}
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
                      <p className="text-sm text-gray-600">Extra security for your account</p>
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
        </motion.div>
      </AnimatePresence>
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
    </>
  )
}

export default AccountTab
