"use client";

import React, { useState, useCallback, memo } from "react";
import Image from "next/image";
import { useInsure } from "../../store/insureStore";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  emergencyContact: string;
  emergencyPhone: string;
  occupation: string;
  maritalStatus: string;
  profileImage: string;
  memberSince: string;
  lastLogin: string;
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  privacyLevel: string;
}




const ProfilePage = memo(() => {
  const { setActivePage } = useInsure();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  
  // Initialize with sample data - in a real app, this would come from the store/API
  const [profile, setProfile] = useState<UserProfile>({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Springfield, IL 62701",
    dateOfBirth: "1985-03-15",
    emergencyContact: "John Johnson",
    emergencyPhone: "+1 (555) 987-6543",
    occupation: "Software Engineer",
    maritalStatus: "Married",
    profileImage: "", // Empty to trigger random icon
    memberSince: "2023-01-15",
    lastLogin: "2024-01-20",
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: true,
    marketingEmails: false,
    privacyLevel: "Standard"
  });

  const [formData, setFormData] = useState<UserProfile>(profile);


  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setFormData(profile);
  }, [profile]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setFormData(profile);
  }, [profile]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProfile(formData);
    setIsEditing(false);
    setIsSaving(false);
  }, [formData]);

  const handleInputChange = useCallback((field: keyof UserProfile, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);


  const handleDeleteAccount = useCallback(async () => {
    if (deleteConfirmation === "DELETE") {
      // Simulate account deletion
      await new Promise(resolve => setTimeout(resolve, 2000));
      setActivePage("homePage");
    }
  }, [deleteConfirmation, setActivePage]);

  const tabs = [
    { id: "personal", label: "Personal Info", icon: "fa-user" },
    { id: "security", label: "Security", icon: "fa-shield" },
    { id: "notifications", label: "Notifications", icon: "fa-bell" },
    { id: "danger", label: "Danger Zone", icon: "fa-exclamation-triangle" }
  ];

  return (
    <main className="p-8">
      <section id="page-header" className="flex justify-between items-center mb-8">
        <div>
          {/* <button
            onClick={handleBackToHome}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Home
          </button> */}
          <h1 className="text-4xl ps-2 font-bold text-brand-gray-600">Account Settings</h1>
          {/* <p className="text-gray-700 mt-1">Manage your account, security, and privacy settings</p> */}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                {profile.profileImage ? (
                  <Image
                    src='/icons/user-profile.png'
                    alt="Profile"
                    width={120}
                    height={120}
                    className="w-30 h-30 rounded-full mx-auto border-4 border-gray-200"
                  />
                ) : (
                  <Image
                    src='/icons/user-profile.png'
                    alt="Profile"
                    width={120}
                    height={120}
                    className="w-30 h-30 rounded-full mx-auto border-4 border-gray-200"
                  />
                )}
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors">
                    <i className="fa-solid fa-camera text-sm"></i>
                  </button>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {isEditing ? formData.name : profile.name}
              </h2>
              <p className="text-gray-600 mb-4">
                {isEditing ? formData.email : profile.email}
              </p>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <i className="fa-solid fa-check-circle mr-1"></i>
                  Premium Member
                </span>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                <p>Member since {new Date(profile.memberSince).toLocaleDateString()}</p>
                <p>Last login: {new Date(profile.lastLogin).toLocaleDateString()}</p>
              </div>

              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <i className="fa-solid fa-edit"></i>
                  Edit Profile
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-save"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <i className="fa-solid fa-times"></i>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                    <img src="/icons/shield.gif" alt="Policies" className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Active Policies</p>
                    <p className="text-xs text-gray-500">5 policies</p>
                  </div>
                </div>
                <span className="text-lg font-semibold text-blue-600">5</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                    <img src="/icons/file-invoice.gif" alt="Claims" className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Total Claims</p>
                    <p className="text-xs text-gray-500">3 claims</p>
                  </div>
                </div>
                <span className="text-lg font-semibold text-green-600">3</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                    <img src="/icons/dollar-sign.gif" alt="Premium" className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Monthly Premium</p>
                    <p className="text-xs text-gray-500">Total amount</p>
                  </div>
                </div>
                <span className="text-lg font-semibold text-purple-600">$880</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-1 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 rounded-t-lg ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 bg-blue-50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <i className={`fa-solid ${tab.icon} mr-2`}></i>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Details */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profile.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profile.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profile.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        {isEditing ? (
                          <textarea
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profile.address}</p>
                        )}
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        {isEditing ? (
                          <input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Occupation
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.occupation}
                            onChange={(e) => handleInputChange('occupation', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profile.occupation}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Marital Status
                        </label>
                        {isEditing ? (
                          <select
                            value={formData.maritalStatus}
                            onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          >
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                          </select>
                        ) : (
                          <p className="text-gray-900 py-2">{profile.maritalStatus}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact Section */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Emergency Contact Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.emergencyContact}
                            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profile.emergencyContact}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Emergency Contact Phone
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={formData.emergencyPhone}
                            onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{profile.emergencyPhone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h3>
                  
                  <div className="space-y-6">
                    {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">Two-Factor Authentication</h5>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        <span className={`text-xs px-2 py-1 rounded-full mt-1 ${
                          profile.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {profile.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        {profile.twoFactorEnabled ? 'Disable' : 'Enable'}
                      </button>
                    </div> */}
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">Change Password</h5>
                        <p className="text-sm text-gray-600">Update your account password</p>
                      </div>
                      <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">Email Notifications</h5>
                        <p className="text-sm text-gray-600">Receive important updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profile.emailNotifications}
                          onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">SMS Notifications</h5>
                        <p className="text-sm text-gray-600">Receive urgent updates via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profile.smsNotifications}
                          onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">Marketing Emails</h5>
                        <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profile.marketingEmails}
                          onChange={(e) => handleInputChange('marketingEmails', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Privacy Level
                      </label>
                      <select
                        value={profile.privacyLevel}
                        onChange={(e) => handleInputChange('privacyLevel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      >
                        <option value="Public">Public</option>
                        <option value="Standard">Standard</option>
                        <option value="Private">Private</option>
                      </select>
                      <p className="text-sm text-gray-600 mt-1">Control who can see your profile information</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">Data Sharing</h5>
                        <p className="text-sm text-gray-600">Allow sharing of anonymized data for service improvement</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">Profile Visibility</h5>
                        <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}


              {/* Danger Zone Tab */}
              {activeTab === "danger" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Danger Zone</h3>
                  
                  <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                          <i className="fa-solid fa-exclamation-triangle text-red-600 text-xl"></i>
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="text-lg font-semibold text-red-800 mb-2">Delete Account</h4>
                        <p className="text-red-700 mb-4">
                          Permanently delete your account and all associated data including policies, claims, and settings. 
                          This action cannot be undone and you will lose access to all your insurance information.
                        </p>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setShowDeleteModal(true)}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                          >
                            <i className="fa-solid fa-trash mr-2"></i>
                            Delete Account
                          </button>
                          <p className="text-sm text-red-600">
                            This action is irreversible
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <i className="fa-solid fa-exclamation-triangle text-red-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Account</h3>
              <p className="text-gray-600 mb-4">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type &quot;DELETE&quot; to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="DELETE"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== "DELETE"}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
});

ProfilePage.displayName = 'ProfilePage';

export default ProfilePage;