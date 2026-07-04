import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { Mail, Phone, MapPin, Calendar, User, Edit3, Save, CheckCircle, ShieldCheck } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {
  const { userData, token, backendUrl, loadUserProfileData } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)

  const [localData, setLocalData] = useState({
    name: "Patient Name",
    email: "patient@example.com",
    phone: "",
    address: "",
    gender: "Not Specified",
    dob: ""
  });

  useEffect(() => {
    if (userData) {
      setLocalData({
        name: userData.name || "Patient Name",
        email: userData.email || "patient@example.com",
        phone: userData.phone || "",
        address: userData.address || "",
        gender: userData.gender || "Not Specified",
        dob: userData.dob ? userData.dob.split('T')[0] : ""
      });
    }
  }, [userData]);

  const handleUpdate = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/update-profile', 
        { 
          name: localData.name,
          phone: localData.phone,
          address: localData.address,
          gender: localData.gender,
          dob: localData.dob || null
        },
        { headers: { token } }
      );
      
      if (data.success) {
        toast.success(data.message || "Profile updated successfully!");
        await loadUserProfileData();
        setIsEdit(false);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in'>
      <div className='bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col md:flex-row'>
        
        {/* Left Side: Profile Summary Card */}
        <div className='md:w-1/3 bg-gradient-to-br from-secondary via-slate-900 to-primary p-8 text-white flex flex-col items-center justify-center text-center relative overflow-hidden'>
          {/* Decorative backdrop glow */}
          <div className='absolute -top-10 -left-10 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl'></div>
          <div className='absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl'></div>

          <div className='relative group z-10'>
            <div className='w-32 h-32 bg-white/10 backdrop-blur-md rounded-full border-4 border-white/20 flex items-center justify-center text-5xl font-black text-white shadow-2xl relative select-none'>
              {localData.name.charAt(0)}
            </div>
            <div className='absolute bottom-0 right-0 bg-teal-400 text-secondary p-2 rounded-full shadow-lg border-2 border-slate-950'>
              <CheckCircle size={16} className='text-white' fill='currentColor' />
            </div>
          </div>

          <h2 className='text-2xl font-black mt-6 tracking-tight z-10'>{localData.name}</h2>
          
          <div className='inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4.5 py-1.5 rounded-full border border-white/20 text-teal-300 text-xs font-black uppercase tracking-widest mt-3 z-10 shadow-sm'>
            <ShieldCheck size={14} />
            Verified Patient
          </div>
          
          <p className='text-white/60 text-xs mt-6 max-w-[200px] leading-relaxed z-10 font-medium'>
            Member since 2026. Your health metrics are encrypted and safely stored in Medicare Plus.
          </p>
        </div>

        {/* Right Side: Form Panel */}
        <div className='flex-1 p-8 sm:p-12 relative'>
          
          <div className='flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-6 mb-8'>
            <div>
              <h3 className='text-2xl font-black text-secondary dark:text-slate-100 tracking-tight'>Profile Settings</h3>
              <p className='text-gray-400 dark:text-slate-550 text-xs mt-1 font-semibold uppercase tracking-wider'>Personal Medical Record</p>
            </div>
            
            {isEdit ? (
              <button 
                onClick={handleUpdate}
                disabled={loading}
                className='flex items-center gap-2 bg-primary hover:bg-teal-700 text-white px-5 py-2.5 rounded-2xl text-sm font-black shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50'
              >
                <Save size={16} />
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            ) : (
              <button 
                onClick={() => setIsEdit(true)}
                className='flex items-center gap-2 bg-accent dark:bg-slate-700 hover:bg-teal-100 dark:hover:bg-slate-650 text-primary dark:text-teal-400 px-5 py-2.5 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 active:translate-y-0'
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            )}
          </div>

          {/* Contact Details */}
          <div className='space-y-6'>
            <div>
              <h4 className='text-xs font-black text-primary uppercase tracking-widest mb-4'>Contact Information</h4>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                
                {/* Email Address */}
                <div className='flex flex-col gap-1.5'>
                  <span className='text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5'>
                    <Mail size={12} /> Email Address
                  </span>
                  <p className='px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-750 rounded-2xl text-secondary dark:text-slate-200 font-semibold text-sm select-none'>
                    {localData.email}
                  </p>
                </div>

                {/* Full Name (Editable) */}
                <div className='flex flex-col gap-1.5'>
                  <span className='text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5'>
                    <User size={12} /> Full Name
                  </span>
                  {isEdit ? (
                    <input 
                      className='px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl text-secondary dark:text-slate-105 font-semibold text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all'
                      type="text" 
                      value={localData.name} 
                      onChange={e => setLocalData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your Name"
                    />
                  ) : (
                    <p className='px-4 py-3 bg-gray-50/50 dark:bg-slate-900/50 border border-transparent text-secondary dark:text-slate-200 font-semibold text-sm'>
                      {localData.name}
                    </p>
                  )}
                </div>

                {/* Phone (Editable) */}
                <div className='flex flex-col gap-1.5'>
                  <span className='text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5'>
                    <Phone size={12} /> Contact Phone
                  </span>
                  {isEdit ? (
                    <input 
                      className='px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl text-secondary dark:text-slate-105 font-semibold text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all'
                      type="text" 
                      value={localData.phone} 
                      onChange={e => setLocalData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Not Provided"
                    />
                  ) : (
                    <p className='px-4 py-3 bg-gray-50/50 dark:bg-slate-900/50 border border-transparent text-secondary dark:text-slate-200 font-semibold text-sm'>
                      {localData.phone || "Not Provided"}
                    </p>
                  )}
                </div>

                {/* Address (Editable) */}
                <div className='flex flex-col gap-1.5'>
                  <span className='text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5'>
                    <MapPin size={12} /> Residential Address
                  </span>
                  {isEdit ? (
                    <input 
                      className='px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl text-secondary dark:text-slate-105 font-semibold text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all'
                      type="text" 
                      value={localData.address} 
                      onChange={e => setLocalData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Not Provided"
                    />
                  ) : (
                    <p className='px-4 py-3 bg-gray-50/50 dark:bg-slate-900/50 border border-transparent text-secondary dark:text-slate-200 font-semibold text-sm'>
                      {localData.address || "Not Provided"}
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* Basic Info */}
            <div className='pt-6 border-t border-gray-50 dark:border-slate-700'>
              <h4 className='text-xs font-black text-primary uppercase tracking-widest mb-4'>Basic Demographics</h4>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                
                {/* Gender (Editable) */}
                <div className='flex flex-col gap-1.5'>
                  <span className='text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5'>
                    <User size={12} /> Gender
                  </span>
                  {isEdit ? (
                    <select 
                      className='px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl text-secondary dark:text-slate-105 font-semibold text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all cursor-pointer'
                      value={localData.gender} 
                      onChange={e => setLocalData(prev => ({ ...prev, gender: e.target.value }))}
                    >
                      <option value="Not Specified">Not Specified</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className='px-4 py-3 bg-gray-50/50 dark:bg-slate-900/50 border border-transparent text-secondary dark:text-slate-200 font-semibold text-sm'>
                      {localData.gender}
                    </p>
                  )}
                </div>

                {/* Birthdate (Editable) */}
                <div className='flex flex-col gap-1.5'>
                  <span className='text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5'>
                    <Calendar size={12} /> Date of Birth
                  </span>
                  {isEdit ? (
                    <input 
                      className='px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl text-secondary dark:text-slate-105 font-semibold text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all cursor-pointer'
                      type="date" 
                      value={localData.dob} 
                      onChange={e => setLocalData(prev => ({ ...prev, dob: e.target.value }))}
                    />
                  ) : (
                    <p className='px-4 py-3 bg-gray-50/50 dark:bg-slate-900/50 border border-transparent text-secondary dark:text-slate-200 font-semibold text-sm'>
                      {localData.dob || "Not Provided"}
                    </p>
                  )}
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default MyProfile
