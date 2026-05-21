import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Users, Calendar, Trash2, X, Plus } from 'lucide-react'

const Admin = () => {
    const { backendUrl, token } = useContext(AppContext)
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [activeTab, setActiveTab] = useState('doctors')
    const [showAddModal, setShowAddModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        specialization: 'General Physician',
        experience: '1',
        fees: '',
        about: '',
        image: ''
    })

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

    const onAddDoctorHandler = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { atoken: token } })
            if (data.success) {
                toast.success(data.message)
                setShowAddModal(false)
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    specialization: 'General Physician',
                    experience: '1',
                    fees: '',
                    about: '',
                    image: ''
                })
                fetchAdminData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
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
                            <button onClick={() => setShowAddModal(true)} className='bg-primary text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-teal-700 transition-all'>
                                <Plus size={16} /> Add Doctor
                            </button>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {doctors.map((doc, idx) => (
                                <div key={idx} className='bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all'>
                                    <div className='w-16 h-16 rounded-full overflow-hidden border-2 border-primary/10'>
                                        <img 
                                            className='w-full h-full object-cover object-top' 
                                            src={doc.image_url || "https://static.vecteezy.com/system/resources/previews/028/250/157/non_2x/handsome-indian-doctor-ai-generative-photo.jpg"} 
                                            alt={doc.name} 
                                            onError={(e) => { e.target.src = "https://static.vecteezy.com/system/resources/previews/028/250/157/non_2x/handsome-indian-doctor-ai-generative-photo.jpg" }}
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <p className='font-extrabold text-gray-800'>{doc.name}</p>
                                        <p className='text-primary text-xs font-semibold uppercase tracking-wider'>{doc.specialization}</p>
                                        <p className='text-gray-400 text-[10px] mt-1 italic'>{doc.email}</p>
                                    </div>
                                    <div className='bg-red-50 p-2 rounded-lg group cursor-pointer hover:bg-red-100 transition-all'>
                                        <Trash2 className='text-red-400 group-hover:text-red-600' size={18} />
                                    </div>
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

            {/* Add Doctor Modal */}
            {showAddModal && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl'>
                        <div className='p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10'>
                            <h3 className='text-xl font-bold text-gray-800'>Add New Doctor</h3>
                            <X className='text-gray-400 cursor-pointer hover:text-gray-600' onClick={() => setShowAddModal(false)} />
                        </div>
                        <form onSubmit={onAddDoctorHandler} className='p-6 space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='space-y-1'>
                                    <p className='text-sm font-medium text-gray-600'>Doctor Name</p>
                                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className='w-full border rounded-lg px-3 py-2 outline-none focus:border-primary' type="text" placeholder='Name' />
                                </div>
                                <div className='space-y-1'>
                                    <p className='text-sm font-medium text-gray-600'>Doctor Email</p>
                                    <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className='w-full border rounded-lg px-3 py-2 outline-none focus:border-primary' type="email" placeholder='Email' />
                                </div>
                                <div className='space-y-1'>
                                    <p className='text-sm font-medium text-gray-600'>Doctor Password</p>
                                    <input required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className='w-full border rounded-lg px-3 py-2 outline-none focus:border-primary' type="password" placeholder='Password' />
                                </div>
                                <div className='space-y-1'>
                                    <p className='text-sm font-medium text-gray-600'>Experience</p>
                                    <select value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className='w-full border rounded-lg px-3 py-2 outline-none focus:border-primary'>
                                        <option value="1">1 Year</option>
                                        <option value="2">2 Year</option>
                                        <option value="3">3 Year</option>
                                        <option value="4">4 Year</option>
                                        <option value="5">5 Year</option>
                                        <option value="6">6 Year</option>
                                        <option value="8">8 Year</option>
                                        <option value="10">10 Year</option>
                                    </select>
                                </div>
                                <div className='space-y-1'>
                                    <p className='text-sm font-medium text-gray-600'>Fees</p>
                                    <input required value={formData.fees} onChange={e => setFormData({...formData, fees: e.target.value})} className='w-full border rounded-lg px-3 py-2 outline-none focus:border-primary' type="number" placeholder='Fees' />
                                </div>
                                <div className='space-y-1'>
                                    <p className='text-sm font-medium text-gray-600'>Specialization</p>
                                    <select value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className='w-full border rounded-lg px-3 py-2 outline-none focus:border-primary'>
                                        <option value="General Physician">General Physician</option>
                                        <option value="Gynecologist">Gynecologist</option>
                                        <option value="Dermatologist">Dermatologist</option>
                                        <option value="Pediatricians">Pediatricians</option>
                                        <option value="Neurologist">Neurologist</option>
                                        <option value="Gastroenterologist">Gastroenterologist</option>
                                    </select>
                                </div>
                            </div>
                            <div className='space-y-1'>
                                <p className='text-sm font-medium text-gray-600'>Image URL</p>
                                <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className='w-full border rounded-lg px-3 py-2 outline-none focus:border-primary' type="text" placeholder='Image URL (optional)' />
                            </div>
                            <div className='space-y-1'>
                                <p className='text-sm font-medium text-gray-600'>About Doctor</p>
                                <textarea required value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} className='w-full border rounded-lg px-3 py-2 outline-none focus:border-primary resize-none' rows={5} placeholder='Write about doctor'></textarea>
                            </div>
                            <button type='submit' className='w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-all'>Add Doctor</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

// Use Users icon as UserMd alias
const UserMd = Users;

export default Admin
