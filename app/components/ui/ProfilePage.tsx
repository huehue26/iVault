"use client";

import React, { useState, useCallback } from 'react';

interface UserProfile {
  name: string;
  email: string;
  age: number;
  gender: string;
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyName: string;
  rolePosition: string;
  companyAddress: string;
  communicationPreference: string;
  emailNotifications: boolean;
  phoneNotifications: boolean;
}

interface NotificationState {
  type: 'success' | 'error' | 'info';
  message: string;
  show: boolean;
}

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    age: 32,
    gender: 'Male',
    address: '123 Innovation Drive, Tech City, TX 12345',
    contactName: 'Jane Smith',
    contactEmail: 'jane.smith@example.com',
    contactPhone: '+1 (555) 123-4567',
    companyName: 'Innovate Inc.',
    rolePosition: 'Account Manager',
    companyAddress: '456 Business Blvd, Suite 200, Commerce City, CA 90210',
    communicationPreference: 'Email & Phone',
    emailNotifications: true,
    phoneNotifications: true
  });

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    type: 'info',
    message: '',
    show: false
  });
  const [profileAvatar, setProfileAvatar] = useState('https://placehold.co/128x128/e0e7ff/4f46e5?text=AD');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['personal']));

  // Password change states
  const [passwordStep, setPasswordStep] = useState<1 | 2 | 3>(1);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const updateProfile = useCallback((field: keyof UserProfile, value: string | number | boolean) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleNotification = useCallback((newNotification: NotificationState) => {
    setNotification(newNotification);
    if (newNotification.show) {
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 4000);
    }
  }, []);

  const openModal = useCallback((modalId: string) => {
    setActiveModal(modalId);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    // Reset password modal states
    setPasswordStep(1);
    setOtpCode('');
    setNewPassword('');
    setConfirmPassword('');
    setOtpError(false);
    setPasswordError(false);
  }, []);

  const handlePhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileAvatar(e.target.result as string);
          handleNotification({
            type: 'success',
            message: 'Profile photo updated successfully!',
            show: true
          });
        }
      };
      reader.readAsDataURL(file);
    }
  }, [handleNotification]);

  const handleSendOTP = useCallback(() => {
    // Simulate sending OTP
    console.log('Sending OTP to:', userProfile.email);
    setPasswordStep(2);
  }, [userProfile.email]);

  const handleVerifyOTP = useCallback(() => {
    if (otpCode === '123456') {
      setOtpError(false);
      setPasswordStep(3);
    } else {
      setOtpError(true);
    }
  }, [otpCode]);

  const handleResetPassword = useCallback(async () => {
    if (newPassword && newPassword === confirmPassword) {
      setPasswordError(false);
      // Simulate password reset
      console.log('Password successfully reset.');
      handleNotification({
        type: 'success',
        message: 'Password changed successfully!',
        show: true
      });
      closeModal();
    } else {
      setPasswordError(true);
    }
  }, [newPassword, confirmPassword, handleNotification, closeModal]);

  const handleDeleteAccount = useCallback(async () => {
    // Simulate account deletion
    await new Promise(resolve => setTimeout(resolve, 2000));
    handleNotification({
      type: 'success',
      message: 'Account deleted successfully.',
        show: true
      });
    closeModal();
  }, [handleNotification, closeModal]);

  const toggleSection = useCallback((sectionName: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName);
      } else {
        newSet.add(sectionName);
      }
      return newSet;
    });
  }, []);

  // Inline edit functionality
  const handleInlineEdit = useCallback((section: string, action: 'edit' | 'save' | 'cancel') => {
    const sectionElement = document.querySelector(`[data-section="${section}"]`) as HTMLElement;
    if (!sectionElement) return;

    const viewMode = sectionElement.querySelector('.view-mode') as HTMLElement;
    const editMode = sectionElement.querySelector('.edit-mode') as HTMLElement;
    const editButton = sectionElement.querySelector('[data-action="edit"]') as HTMLElement;

    if (action === 'edit') {
      viewMode.style.display = 'none';
      editMode.style.display = 'block';
      editButton.style.display = 'none';
    } else if (action === 'cancel') {
      viewMode.style.display = 'block';
      editMode.style.display = 'none';
      editButton.style.display = 'block';
    } else if (action === 'save') {
      const form = sectionElement.querySelector('form') as HTMLFormElement;
      if (form) {
        const formData = new FormData(form);
        const updates: Partial<UserProfile> = {};

        formData.forEach((value, key) => {
          if (key === 'age') {
            (updates as any)[key] = parseInt(value as string);
          } else if (key === 'emailNotifications' || key === 'phoneNotifications') {
            (updates as any)[key] = (value === 'on');
          } else {
            (updates as any)[key] = value as string;
          }
        });

        // Update profile
        Object.entries(updates).forEach(([key, value]) => {
          updateProfile(key as keyof UserProfile, value as string | number | boolean);
        });

        // Handle special cases
        if (section === 'personal') {
          const fullNameHeader = document.querySelector('[data-field="full-name-header"]') as HTMLElement;
          const emailHeader = document.querySelector('[data-field="email-header"]') as HTMLElement;
          if (fullNameHeader) fullNameHeader.textContent = updates.name as string;
          if (emailHeader) emailHeader.textContent = updates.email as string;
        } else if (section === 'communication') {
          const emailChecked = updates.emailNotifications as boolean;
          const phoneChecked = updates.phoneNotifications as boolean;
          const viewElement = sectionElement.querySelector('[data-field="communication-preference"]') as HTMLElement;

          let prefText = 'None';
          if (emailChecked && phoneChecked) {
            prefText = 'Email & Phone';
          } else if (emailChecked) {
            prefText = 'Email only';
          } else if (phoneChecked) {
            prefText = 'Phone only';
          }
          if (viewElement) viewElement.textContent = prefText;
      } else {
          // Update view mode with form values
          const inputs = form.querySelectorAll('input, select, textarea');
          inputs.forEach(input => {
            const fieldName = (input as HTMLInputElement).name;
            const viewElement = sectionElement.querySelector(`.view-mode [data-field="${fieldName}"]`) as HTMLElement;
            if (viewElement) {
              viewElement.textContent = (input as HTMLInputElement).value;
            }
          });
        }

        // Switch back to view mode
        viewMode.style.display = 'block';
        editMode.style.display = 'none';
        editButton.style.display = 'block';

        handleNotification({
          type: 'success',
          message: `${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully!`,
          show: true
        });
      }
    }
  }, [updateProfile, handleNotification]);

  return (
    <div className="bg-white text-neutral-900 overflow-x-hidden">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border max-w-sm transition-all duration-300 ${
          notification.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : notification.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center gap-3">
            <img
              src={`/icons/${notification.type === 'success' ? 'check-circle' : notification.type === 'error' ? 'exclamation-triangle' : 'info'}.gif`}
              alt={notification.type}
              className="w-5 h-5"
            />
            <p className="text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
        <header className="mb-10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <i className="fa-solid fa-cog text-4xl text-blue-500"></i>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur opacity-20"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Account Settings</h1>
              <p className="mt-1 text-md text-neutral-600">Manage your account settings and personal information.</p>
            </div>
          </div>
        </header>

        <main className="space-y-8">
          {/* User Profile Header */}
          <section className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex items-center space-x-4">
            <div className="relative">
              <img className="h-16 w-16 rounded-full" id="profile-avatar" src={profileAvatar} alt="User Avatar" />
              <label htmlFor="photo-upload" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full text-white text-xs opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
                Change
              </label>
              <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
        </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900" data-field="full-name-header">{userProfile.name}</h2>
              <p className="text-sm text-neutral-600" data-field="email-header">{userProfile.email}</p>
              <p className="mt-1 text-xs text-neutral-500">Member since Sep 2024</p>
      </div>
          </section>

          {/* Personal Information Section */}
          <section data-section="personal" className="bg-white border border-gray-200 rounded-2xl shadow-lg">
            <div
              className="p-6 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('personal')}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <i className="fa-solid fa-user text-2xl text-blue-500"></i>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur opacity-20"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Personal Information</h3>
                  <p className="mt-1 text-sm text-neutral-600">Your personal details.</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  data-action="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInlineEdit('personal', 'edit');
                  }}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Edit
                </button>
                <i className={`fa-solid fa-chevron-down text-neutral-500 transition-transform duration-200 ${expandedSections.has('personal') ? 'rotate-180' : ''}`}></i>
              </div>
            </div>
            {expandedSections.has('personal') && (
              <>
                {/* View Mode */}
                <div className="p-6 view-mode">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-neutral-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-neutral-900" data-field="name">{userProfile.name}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-neutral-500">Email address</dt>
                  <dd className="mt-1 text-sm text-neutral-900" data-field="email">{userProfile.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-neutral-500">Age</dt>
                  <dd className="mt-1 text-sm text-neutral-900" data-field="age">{userProfile.age}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-neutral-500">Gender</dt>
                  <dd className="mt-1 text-sm text-neutral-900" data-field="gender">{userProfile.gender}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-neutral-500">Address</dt>
                  <dd className="mt-1 text-sm text-neutral-900" data-field="address">{userProfile.address}</dd>
      </div>
              </dl>
            </div>
            {/* Edit Mode */}
            <form className="p-6 edit-mode hidden">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Full Name</label>
                  <input type="text" name="name" defaultValue={userProfile.name} className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email address</label>
                  <input type="email" name="email" defaultValue={userProfile.email} className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-neutral-700">Age</label>
                  <input type="number" name="age" defaultValue={userProfile.age} className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-neutral-700">Gender</label>
                  <select name="gender" defaultValue={userProfile.gender} className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-neutral-700">Address</label>
                  <textarea name="address" rows={3} defaultValue={userProfile.address} className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm resize-none" />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-x-4">
                <button type="button" data-action="cancel" onClick={() => handleInlineEdit('personal', 'cancel')} className="text-sm font-semibold leading-6 text-neutral-700 hover:text-neutral-900">Cancel</button>
                <button type="button" data-action="save" onClick={() => handleInlineEdit('personal', 'save')} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">Save</button>
          </div>
            </form>
              </>
            )}
          </section>

          {/* Contact Person Section */}
          <section data-section="contact" className="bg-white border border-gray-200 rounded-2xl shadow-lg">
            <div
              className="p-6 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('contact')}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <i className="fa-solid fa-address-book text-2xl text-teal-500"></i>
                  <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full blur opacity-20"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Contact Person</h3>
                  <p className="mt-1 text-sm text-neutral-600">Details for your point of contact.</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  data-action="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInlineEdit('contact', 'edit');
                  }}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Edit
            </button>
                <i className={`fa-solid fa-chevron-down text-neutral-500 transition-transform duration-200 ${expandedSections.has('contact') ? 'rotate-180' : ''}`}></i>
              </div>
            </div>
            {expandedSections.has('contact') && (
              <>
                {/* View Mode */}
                <div className="p-6 view-mode">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-neutral-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-neutral-900" data-field="contactName">{userProfile.contactName}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-neutral-500">Email address</dt>
                  <dd className="mt-1 text-sm text-neutral-900" data-field="contactEmail">{userProfile.contactEmail}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-neutral-500">Phone</dt>
                  <dd className="mt-1 text-sm text-neutral-900" data-field="contactPhone">{userProfile.contactPhone}</dd>
                </div>
              </dl>
            </div>
            {/* Edit Mode */}
            <form className="p-6 edit-mode hidden">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                <div className="sm:col-span-2">
                  <label htmlFor="contactName" className="block text-sm font-medium text-neutral-700">Full Name</label>
                  <input type="text" name="contactName" defaultValue={userProfile.contactName} className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-neutral-700">Email address</label>
                  <input type="email" name="contactEmail" defaultValue={userProfile.contactEmail} className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm" />
          </div>
                <div className="sm:col-span-2">
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-neutral-700">Phone</label>
                  <input type="tel" name="contactPhone" defaultValue={userProfile.contactPhone} className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm" />
        </div>
      </div>
              <div className="mt-6 flex items-center justify-end gap-x-4">
                <button type="button" data-action="cancel" onClick={() => handleInlineEdit('contact', 'cancel')} className="text-sm font-semibold leading-6 text-neutral-700 hover:text-neutral-900">Cancel</button>
                <button type="button" data-action="save" onClick={() => handleInlineEdit('contact', 'save')} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">Save</button>
              </div>
            </form>
              </>
            )}
          </section>

          {/* Professional Details Section */}
          <section data-section="professional" className="bg-white border border-gray-200 rounded-2xl shadow-lg">
            <div
              className="p-6 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('professional')}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <i className="fa-solid fa-briefcase text-2xl text-amber-500"></i>
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full blur opacity-20"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Professional Details</h3>
                  <p className="mt-1 text-sm text-neutral-600">Your employment information.</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  data-action="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInlineEdit('professional', 'edit');
                  }}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Edit
                </button>
                <i className={`fa-solid fa-chevron-down text-neutral-500 transition-transform duration-200 ${expandedSections.has('professional') ? 'rotate-180' : ''}`}></i>
              </div>
            </div>
            {expandedSections.has('professional') && (
              <>
                {/* View Mode */}
                <div className="p-6 view-mode">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-neutral-500">Company Name</dt>
                  <dd className="mt-1 text-sm text-neutral-900" data-field="companyName">{userProfile.companyName}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-neutral-500">Role / Position</dt>
                  <dd className="mt-1 text-sm text-neutral-900" data-field="rolePosition">{userProfile.rolePosition}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-neutral-500">Company Address</dt>
                  <dd className="mt-1 text-sm text-neutral-900" data-field="companyAddress">{userProfile.companyAddress}</dd>
                </div>
              </dl>
                  </div>
            {/* Edit Mode */}
            <form className="p-6 edit-mode hidden">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-neutral-700">Company Name</label>
                  <input type="text" name="companyName" defaultValue={userProfile.companyName} className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm" />
                  </div>
                <div>
                  <label htmlFor="rolePosition" className="block text-sm font-medium text-neutral-700">Role / Position</label>
                  <input type="text" name="rolePosition" defaultValue={userProfile.rolePosition} className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm" />
                  </div>
                <div className="sm:col-span-2">
                  <label htmlFor="companyAddress" className="block text-sm font-medium text-neutral-700">Company Address</label>
                  <textarea name="companyAddress" rows={3} defaultValue={userProfile.companyAddress} className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm resize-none" />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-x-4">
                <button type="button" data-action="cancel" onClick={() => handleInlineEdit('professional', 'cancel')} className="text-sm font-semibold leading-6 text-neutral-700 hover:text-neutral-900">Cancel</button>
                <button type="button" data-action="save" onClick={() => handleInlineEdit('professional', 'save')} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">Save</button>
              </div>
            </form>
              </>
            )}
          </section>

          {/* Communication Preferences Section */}
          <section data-section="communication" className="bg-white border border-gray-200 rounded-2xl shadow-lg">
            <div
              className="p-6 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('communication')}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <i className="fa-solid fa-bell text-2xl text-rose-500"></i>
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-rose-600 rounded-full blur opacity-20"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Communication Preferences</h3>
                  <p className="mt-1 text-sm text-neutral-600">Manage how you receive notifications.</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  data-action="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInlineEdit('communication', 'edit');
                  }}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Edit
                </button>
                <i className={`fa-solid fa-chevron-down text-neutral-500 transition-transform duration-200 ${expandedSections.has('communication') ? 'rotate-180' : ''}`}></i>
              </div>
            </div>
            {expandedSections.has('communication') && (
              <>
                {/* View Mode */}
                <div className="p-6 view-mode">
              <dl>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Notification Channels</dt>
                  <dd className="mt-1 text-sm text-neutral-900" data-field="communicationPreference">{userProfile.communicationPreference}</dd>
                </div>
              </dl>
            </div>
            {/* Edit Mode */}
            <form className="p-6 edit-mode hidden">
              <div className="space-y-4">
                <div id="phone-warning" className="hidden rounded-md bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Phone Number Required</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Please add a phone number in your Contact Person details to enable phone notifications.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <fieldset className="space-y-2">
                  <legend className="sr-only">Notifications</legend>
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input id="email-notif" name="emailNotifications" type="checkbox" defaultChecked={userProfile.emailNotifications} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label htmlFor="email-notif" className="font-medium text-neutral-900">Email Notifications</label>
                    </div>
                  </div>
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input id="phone-notif" name="phoneNotifications" type="checkbox" defaultChecked={userProfile.phoneNotifications} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                  </div>
                    <div className="ml-3 text-sm leading-6">
                      <label htmlFor="phone-notif" className="font-medium text-neutral-900">Phone Notifications</label>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div className="mt-6 flex items-center justify-end gap-x-4">
                <button type="button" data-action="cancel" onClick={() => handleInlineEdit('communication', 'cancel')} className="text-sm font-semibold leading-6 text-neutral-700 hover:text-neutral-900">Cancel</button>
                <button type="button" data-action="save" onClick={() => handleInlineEdit('communication', 'save')} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">Save</button>
              </div>
            </form>
              </>
            )}
          </section>

          {/* Account Security Section */}
          <section data-section="security" className="bg-white border border-gray-200 rounded-2xl shadow-lg">
            <div
              className="p-6 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('security')}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <i className="fa-solid fa-shield-halved text-2xl text-blue-500"></i>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur opacity-20"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Account Security</h3>
                  <p className="mt-1 text-sm text-neutral-600">Manage your account security settings.</p>
                </div>
              </div>
              <i className={`fa-solid fa-chevron-down text-neutral-500 transition-transform duration-200 ${expandedSections.has('security') ? 'rotate-180' : ''}`}></i>
            </div>
            {expandedSections.has('security') && (
              <div className="divide-y divide-gray-200">
              <button
                onClick={() => openModal('change-password-modal')}
                className="w-full flex items-center justify-between text-left p-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              >
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  <div>
                    <p className="font-medium text-neutral-800">Change Password</p>
                    <p className="text-sm text-neutral-500">Update your account password</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
                    </button>
                    <button
                onClick={() => openModal('remove-account-modal')}
                className="w-full flex items-center justify-between text-left p-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset"
              >
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09a2.09 2.09 0 00-2.09 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  <div>
                    <p className="font-medium text-red-600">Delete Account</p>
                    <p className="text-sm text-neutral-500">Permanently remove your account</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Modals */}
      {/* Change Password Modal */}
      <div id="change-password-modal" className={`modal fixed inset-0 bg-gray-900 bg-opacity-50 ${activeModal === 'change-password-modal' ? 'flex' : 'hidden'} items-center justify-center z-50`}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
          {/* Step 1: Send OTP */}
          <div className={`${passwordStep === 1 ? '' : 'hidden'}`}>
            <h3 className="text-lg font-medium text-neutral-900">Change Password</h3>
            <p className="text-sm text-neutral-500 mt-1">Enter your email to receive a verification code.</p>
            <div className="mt-4">
              <label htmlFor="otp-email" className="block text-sm font-medium text-neutral-700">Email</label>
              <input type="email" id="otp-email" value={userProfile.email} readOnly className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none sm:text-sm" />
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-4">
              <button type="button" onClick={closeModal} className="text-sm font-semibold leading-6 text-neutral-700 hover:text-neutral-900">Cancel</button>
              <button type="button" onClick={handleSendOTP} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">Send Code</button>
            </div>
          </div>

          {/* Step 2: Verify OTP */}
          <div className={`${passwordStep === 2 ? '' : 'hidden'}`}>
            <h3 className="text-lg font-medium text-neutral-900">Verify Code</h3>
            <p className="text-sm text-neutral-500 mt-1">A 6-digit code has been sent to your email.</p>
            <div className="mt-4">
              <label htmlFor="otp-code" className="block text-sm font-medium text-neutral-700">Verification Code</label>
              <input type="text" id="otp-code" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm" placeholder="123456" />
              <p className={`text-xs text-red-600 mt-1 ${otpError ? '' : 'hidden'}`}>Invalid verification code.</p>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-4">
              <button type="button" onClick={closeModal} className="text-sm font-semibold leading-6 text-neutral-700 hover:text-neutral-900">Cancel</button>
              <button type="button" onClick={handleVerifyOTP} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">Verify</button>
                    </div>
                  </div>

          {/* Step 3: Reset Password */}
          <div className={`${passwordStep === 3 ? '' : 'hidden'}`}>
            <h3 className="text-lg font-medium text-neutral-900">Set New Password</h3>
            <p className="text-sm text-neutral-500 mt-1">Create a new password for your account.</p>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-neutral-700">New Password</label>
                <input type="password" id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-700">Confirm New Password</label>
                <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm" />
              </div>
              <p className={`text-xs text-red-600 mt-1 ${passwordError ? '' : 'hidden'}`}>Passwords do not match.</p>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-4">
              <button type="button" onClick={closeModal} className="text-sm font-semibold leading-6 text-neutral-700 hover:text-neutral-900">Cancel</button>
              <button type="button" onClick={handleResetPassword} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">Set Password</button>
            </div>
          </div>
        </div>
                  </div>

      {/* Remove Account Modal */}
      <div id="remove-account-modal" className={`modal fixed inset-0 bg-gray-900 bg-opacity-50 ${activeModal === 'remove-account-modal' ? 'flex' : 'hidden'} items-center justify-center z-50`}>
        <div className="relative top-0 mx-auto p-5 border w-full max-w-md shadow-lg rounded-2xl bg-white">
          <div className="mt-3 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h3 className="text-lg leading-6 font-medium text-neutral-900 mt-2">Remove Account</h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-sm text-neutral-500">Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.</p>
                  </div>
            <div className="items-center px-4 py-3 space-y-2 sm:space-y-0 sm:flex sm:space-x-2 sm:flex-row-reverse">
              <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full sm:w-auto shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">Yes, I&apos;m sure</button>
              <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-neutral-800 text-base font-medium rounded-md w-full sm:w-auto shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
