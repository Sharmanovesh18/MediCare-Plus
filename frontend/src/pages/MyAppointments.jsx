import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {

    const { backendUrl, token, getDoctorsData } = useContext(AppContext)
    const [appointments, setAppointments] = useState([])

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

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div>
            <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
            <div>
                {appointments.map((item, index) => (
                    <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
                        <div>
                            <img className='w-32 bg-indigo-50 rounded-lg' src={item.doctor_image} alt="" />
                        </div>
                        <div className='flex-1 text-sm text-zinc-600'>
                            <p className='text-neutral-800 font-semibold'>{item.doctor_name}</p>
                            <p>{item.doctor_specialization}</p>
                            <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                            <p className='text-xs'>Hospital Campus, Building A</p>
                            <p className='text-xs'>Floor 2, Room 304</p>
                            <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {new Date(item.appointment_date).toDateString()} |  {item.appointment_time}</p>
                        </div>
                        <div></div>
                        <div className='flex flex-col gap-2 justify-end'>
                            {item.status !== 'Cancelled' && <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
                            {item.status !== 'Cancelled' && <button onClick={() => cancelAppointment(item.id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
                            {item.status === 'Cancelled' && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyAppointments
