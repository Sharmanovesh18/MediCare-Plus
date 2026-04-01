import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'

const MyProfile = () => {

  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)

  const [localData, setLocalData] = useState({
    name: "Patient Name",
    email: "patient@example.com",
    phone: "000-000-0000",
    address: "123 Street",
    gender: "Not Specified",
    dob: "2000-01-01"
  });

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>
      <div className='flex items-center gap-4'>
        <div className='w-36 h-36 bg-gray-200 rounded-lg flex items-center justify-center text-4xl text-gray-400 font-bold uppercase'>
          {localData.name.charAt(0)}
        </div>
        {isEdit ? <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4 outline-primary border border-gray-100 rounded px-2' type="text" value={localData.name} onChange={e => setLocalData(prev => ({ ...prev, name: e.target.value }))} /> : <p className='font-medium text-3xl text-neutral-800 mt-4'>{localData.name}</p>}
      </div>

      <hr className='bg-zinc-400 h-[1px] border-none' />
      <div>
        <p className='text-neutral-500 underline mt-3 uppercase'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{localData.email}</p>
          <p className='font-medium'>Phone:</p>
          {isEdit ? <input className='bg-gray-100 max-w-52 px-2 rounded outline-primary' type="text" value={localData.phone} onChange={e => setLocalData(prev => ({ ...prev, phone: e.target.value }))} /> : <p className='text-blue-400'>{localData.phone}</p>}
          <p className='font-medium'>Address:</p>
          {isEdit ? <input className='bg-gray-100 max-w-52 px-2 rounded outline-primary' type="text" value={localData.address} onChange={e => setLocalData(prev => ({ ...prev, address: e.target.value }))} /> : <p className='text-gray-500'>{localData.address}</p>}
        </div>
      </div>

      <div>
        <p className='text-neutral-500 underline mt-3 uppercase'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {isEdit ? <select className='max-w-20 bg-gray-100' onChange={(e) => setLocalData(prev => ({ ...prev, gender: e.target.value }))} value={localData.gender}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select> : <p className='text-gray-400'>{localData.gender}</p>}
          <p className='font-medium'>Birthday:</p>
          {isEdit ? <input className='max-w-28 bg-gray-100' type="date" onChange={(e) => setLocalData(prev => ({ ...prev, dob: e.target.value }))} value={localData.dob} /> : <p className='text-gray-400'>{localData.dob}</p>}
        </div>
      </div>

      <div className='mt-10'>
        {isEdit ? <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={() => setIsEdit(false)}>Save information</button> : <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={() => setIsEdit(true)}>Edit</button>}
      </div>
    </div>
  )
}

export default MyProfile
