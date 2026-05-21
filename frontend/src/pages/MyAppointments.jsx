import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, MapPin, DollarSign, CheckCircle2, AlertCircle, XCircle, CreditCard, Trash2 } from 'lucide-react'

const MyAppointments = () => {
    const { backendUrl, token, getDoctorsData, currencySymbol } = useContext(AppContext)
    const [appointments, setAppointments] = useState([])
    const [loadingId, setLoadingId] = useState(null)
    const navigate = useNavigate()

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            if (data.success) {
                setAppointments(data.appointments.reverse())
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
                getDoctorsData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
    }

    const appointmentStripe = async (appointmentId) => {
        setLoadingId(appointmentId)
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                window.location.replace(data.session_url)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoadingId(null)
        }
    }

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get("success") && query.get("appointmentId")) {
            const verifyStripePayment = async () => {
                try {
                    const { data } = await axios.post(backendUrl + '/api/user/verify-stripe', { 
                        appointmentId: query.get("appointmentId"),
                        success: query.get("success")
                    }, { headers: { token } })
                    
                    if (data.success) {
                        toast.success("Payment Successful")
                        getUserAppointments()
                    } else {
                        toast.error(data.message)
                    }
                    navigate('/my-appointments', { replace: true })
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                    navigate('/my-appointments', { replace: true })
                }
            }
            if (token) {
                verifyStripePayment()
            }
        }
    }, [token, backendUrl, navigate])

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    const doctorPlaceholder = "https://static.vecteezy.com/system/resources/previews/028/250/157/non_2x/handsome-indian-doctor-ai-generative-photo.jpg"

    return (
        <div className='max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in'>
            {/* Header section with styling */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 dark:border-slate-850 pb-6 mb-8'>
                <div>
                    <h3 className='text-3xl font-black text-secondary dark:text-slate-100 tracking-tight'>My Appointments</h3>
                    <p className='text-gray-400 dark:text-slate-500 text-xs mt-1 font-semibold uppercase tracking-wider'>Manage your bookings & consulting schedule</p>
                </div>
                
                {/* Stats badge counter */}
                <div className='mt-4 sm:mt-0 bg-accent dark:bg-slate-800 text-primary dark:text-teal-400 px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2'>
                    <Calendar size={16} />
                    <span>{appointments.length} Total Bookings</span>
                </div>
            </div>

            {appointments.length === 0 ? (
                <div className='bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2rem] p-12 text-center flex flex-col items-center justify-center'>
                    <AlertCircle size={48} className='text-gray-300 dark:text-slate-700 mb-4' />
                    <p className='text-gray-500 dark:text-slate-300 font-bold text-lg'>No Appointments Found</p>
                    <p className='text-gray-400 dark:text-slate-450 text-sm mt-1 max-w-sm'>You don't have any booked appointments. Go book an appointment with our specialist doctors today!</p>
                </div>
            ) : (
                <div className='space-y-6'>
                    {appointments.map((item, index) => {
                        const isCancelled = item.status === 'Cancelled';
                        const isCompleted = item.status === 'Completed';
                        const isPaid = item.payment;
                        
                        return (
                            <div 
                              key={index}
                              className={`group bg-white dark:bg-slate-850 border rounded-[2rem] p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-6 ${isCancelled ? 'border-red-100/50 dark:border-red-900/30 bg-red-50/10 dark:bg-red-950/5' : 'border-gray-100 dark:border-slate-800'}`}
                            >
                                {/* Doctor circular image */}
                                <div className='relative flex-shrink-0'>
                                    <div className={`w-28 h-28 rounded-2xl overflow-hidden border-4 ${isCancelled ? 'border-red-100 dark:border-red-950' : 'border-primary/10 dark:border-teal-900/20 group-hover:border-primary dark:group-hover:border-teal-400'} transition-all duration-300 shadow-sm`}>
                                        <img 
                                          className='w-full h-full object-cover object-top' 
                                          src={item.doctor_image || doctorPlaceholder} 
                                          onError={(e) => { e.target.src = doctorPlaceholder }}
                                          alt={item.doctor_name} 
                                        />
                                    </div>
                                    <div className='absolute -bottom-1 -right-1'>
                                        {isPaid && !isCancelled && (
                                            <span className='bg-teal-500 text-white p-1 rounded-full shadow-md flex items-center justify-center border-2 border-white dark:border-slate-850'><CheckCircle2 size={12} /></span>
                                        )}
                                    </div>
                                </div>

                                {/* Appointment details */}
                                <div className='flex-1 text-sm'>
                                    <div className='flex items-center gap-2 flex-wrap'>
                                        <h4 className={`text-lg font-black text-secondary dark:text-slate-100 group-hover:text-primary transition-colors ${isCancelled ? 'line-through text-gray-400 dark:text-slate-500' : ''}`}>
                                            {item.doctor_name}
                                        </h4>
                                        <span className='px-2.5 py-0.5 bg-accent dark:bg-slate-700 text-primary dark:text-teal-400 text-[10px] font-black uppercase rounded-full tracking-wider'>
                                            {item.doctor_specialization}
                                        </span>
                                    </div>

                                    {/* Location details */}
                                    <p className='text-gray-400 dark:text-slate-400 text-xs mt-1.5 flex items-center gap-1.5 font-medium'>
                                        <MapPin size={12} /> Hospital Campus, Building A, Floor 2, Room 304
                                    </p>

                                    {/* Date & Time indicators */}
                                    <div className='flex flex-wrap gap-4 mt-4'>
                                        <div className='inline-flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-650 px-3 py-1.5 rounded-xl text-xs font-semibold text-secondary/80 dark:text-slate-200'>
                                            <Calendar size={13} className='text-primary dark:text-teal-400' />
                                            {new Date(item.appointment_date).toDateString()}
                                        </div>
                                        <div className='inline-flex items-center gap-2 bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-650 px-3 py-1.5 rounded-xl text-xs font-semibold text-secondary/80 dark:text-slate-200'>
                                            <Clock size={13} className='text-primary dark:text-teal-400' />
                                            {item.appointment_time}
                                        </div>
                                    </div>
                                </div>

                                {/* Price / Fees */}
                                <div className='flex md:flex-col items-baseline md:items-end justify-between w-full md:w-auto md:border-l md:border-gray-50 dark:border-slate-750 md:pl-6 py-2'>
                                    <span className='text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider'>Consultation Fee</span>
                                    <span className='text-2xl font-black text-secondary dark:text-slate-100 mt-1 flex items-center'>
                                        <span className='text-sm text-primary dark:text-teal-400 font-bold mr-0.5'>{currencySymbol}</span>
                                        {item.doctor_fees || item.fees}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-52 flex-shrink-0 justify-end self-stretch md:justify-center border-t border-gray-50 dark:border-slate-750 pt-4 md:pt-0 md:border-t-0'>
                                    {isCancelled && (
                                        <div className='w-full text-center py-3 border border-red-200 dark:border-red-950 bg-red-50/50 dark:bg-red-950/20 rounded-2xl text-red-500 dark:text-red-400 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5'>
                                            <XCircle size={14} /> Appointment Cancelled
                                        </div>
                                    )}
                                    {isCompleted && (
                                        <div className='w-full text-center py-3 border border-emerald-200 dark:border-emerald-950 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5'>
                                            <CheckCircle2 size={14} /> Session Completed
                                        </div>
                                    )}

                                    {!isCancelled && !isCompleted && (
                                        <>
                                            {isPaid ? (
                                                <div className='w-full text-center py-3 border border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-950/20 rounded-2xl text-teal-600 dark:text-teal-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-sm'>
                                                    <CheckCircle2 size={14} fill='currentColor' className='text-white' /> Paid & Confirmed
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => appointmentStripe(item.id)} 
                                                    disabled={loadingId === item.id}
                                                    className='w-full py-3 rounded-2xl bg-primary hover:bg-teal-700 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50'
                                                >
                                                    <CreditCard size={14} /> 
                                                    {loadingId === item.id ? 'Connecting...' : 'Pay Online'}
                                                </button>
                                            )}

                                            <button 
                                                onClick={() => cancelAppointment(item.id)} 
                                                className='w-full py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 border border-gray-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-900/50 text-gray-500 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all hover:-translate-y-0.5 active:translate-y-0'
                                            >
                                                <Trash2 size={14} /> Cancel Appointment
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default MyAppointments
