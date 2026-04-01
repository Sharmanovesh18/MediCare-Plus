import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Users, Calendar, Trash2 } from 'lucide-react'

const Admin = () => {
    const { backendUrl, token } = useContext(AppContext)
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [activeTab, setActiveTab] = useState('doctors')

    const fetchAdminData = async () => {
        try {
            // Reusing user token for demo or separate admin token logic
            const { data: docData } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { atoken: token } })
            if (docData.success) setDoctors(docData.doctors)

            const { data: appData } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { atoken: token } })
            if (appData.success) setAppointments(appData.appointments)
        } catch (error) {
            console.error(error)
            // toast.error("Admin access required")
        }
    }

    useEffect(() => {
        if (token) fetchAdminData()
    }, [token])

    return (
        <div className='flex flex-col md:flex-row gap-5 mt-5 min-h-[70vh]'>
            {/* Sidebar */}
            <div className='w-full md:w-64 border-r pr-5 space-y-2'>
                <p className='text-xs text-gray-400 uppercase font-bold px-3 py-2'>Admin Menu</p>
                <div onClick={() => setActiveTab('doctors')} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${activeTab === 'doctors' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                    <UserMd size={18} />
                    <span>Manage Doctors</span>
                </div>
                <div onClick={() => setActiveTab('appointments')} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${activeTab === 'appointments' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
                    <Calendar size={18} />
                    <span>View Appointments</span>
                </div>
            </div>

            {/* Content Area */}
            <div className='flex-1 bg-gray-50 rounded-xl p-5 shadow-inner'>
                {activeTab === 'doctors' ? (
                    <div>
                        <div className='flex justify-between items-center mb-5'>
                            <h2 className='text-2xl font-bold text-gray-800'>Doctors List</h2>
                            <button className='bg-primary text-white px-4 py-2 rounded-lg text-sm'>+ Add Doctor</button>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {doctors.map((doc, idx) => (
                                <div key={idx} className='bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center text-sm'>
                                    <div>
                                        <p className='font-bold'>{doc.name}</p>
                                        <p className='text-gray-500'>{doc.specialization}</p>
                                    </div>
                                    <Trash2 className='text-red-400 cursor-pointer hover:text-red-600' size={18} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800 mb-5'>All Appointments</h2>
                        <div className='overflow-x-auto'>
                            <table className='w-full text-left text-sm bg-white rounded-lg overflow-hidden'>
                                <thead className='bg-gray-800 text-white'>
                                    <tr>
                                        <th className='p-3'>#</th>
                                        <th className='p-3'>Patient</th>
                                        <th className='p-3'>Doctor</th>
                                        <th className='p-3'>Date/Time</th>
                                        <th className='p-3'>Status</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-100'>
                                    {appointments.map((item, idx) => (
                                        <tr key={idx} className='hover:bg-gray-50'>
                                            <td className='p-3'>{idx + 1}</td>
                                            <td className='p-3 font-medium'>{item.user_name}</td>
                                            <td className='p-3'>{item.doctor_name}</td>
                                            <td className='p-3 text-xs'>{new Date(item.appointment_date).toLocaleDateString()} at {item.appointment_time}</td>
                                            <td className='p-3'>
                                                <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${item.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Use Users icon as UserMd alias
const UserMd = Users;

export default Admin
