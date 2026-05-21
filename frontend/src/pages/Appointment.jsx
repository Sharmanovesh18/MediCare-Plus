import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { CheckCircle, Info } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {

    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)

    // Premium Circular Placeholder for Doctors
    const doctorPlaceholder = "https://static.vecteezy.com/system/resources/previews/028/250/157/non_2x/handsome-indian-doctor-ai-generative-photo.jpg"

    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(null)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')

    const navigate = useNavigate()

    const fetchDocInfo = async () => {
        const docInfo = doctors.find(doc => doc.id == docId)
        setDocInfo(docInfo)
    }

    const getAvailableSlots = async () => {
        setDocSlots([])

        // getting current date
        let today = new Date()

        for (let i = 0; i < 7; i++) {
            // getting date with index 
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            // setting end time of the date with index
            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            // setting hours 
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = []

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                
                // add slot to array
                timeSlots.push({
                    datetime: new Date(currentDate),
                    time: formattedTime
                })

                // Increment current time by 30 minutes
                currentDate.setMinutes(currentDate.getMinutes() + 30)
            }

            setDocSlots(prev => ([...prev, timeSlots]))
        }

    }

    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Login to book appointment')
            window.dispatchEvent(new CustomEvent('booking_status', { 
                detail: { success: false, reason: 'not_logged_in', message: 'Login to book appointment' } 
            }));
            return navigate('/login')
        }

        if (!slotTime) {
            window.dispatchEvent(new CustomEvent('booking_status', { 
                detail: { success: false, reason: 'missing_slot', message: 'Please select a time slot first' } 
            }));
            return toast.warning('Please select a time slot first')
        }

        try {
            const date = docSlots[slotIndex][0].datetime
            let day = date.getDate().toString().padStart(2, '0')
            let month = (date.getMonth() + 1).toString().padStart(2, '0')
            let year = date.getFullYear()

            const slotDate = `${year}-${month}-${day}`

            // Dispatch event for booking request started
            window.dispatchEvent(new CustomEvent('booking_started', { 
                detail: { docId, slotDate, slotTime } 
            }));

            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getDoctorsData()
                
                // Dispatch custom event for successful booking
                window.dispatchEvent(new CustomEvent('booking_status', { 
                    detail: { success: true, docId, slotDate, slotTime, message: data.message } 
                }));

                navigate('/my-appointments')
            } else {
                toast.error(data.message)
                
                // Dispatch custom event for failed booking from API response
                window.dispatchEvent(new CustomEvent('booking_status', { 
                    detail: { success: false, reason: 'api_error', message: data.message } 
                }));
            }

        } catch (error) {
            console.error(error)
            const errMsg = error.response?.data?.message || error.message;
            toast.error(errMsg)
            
            // Dispatch custom event for failed booking due to network/server crash
            window.dispatchEvent(new CustomEvent('booking_status', { 
                detail: { success: false, reason: 'network_error', message: errMsg } 
            }));
        }
    }

    useEffect(() => {
        fetchDocInfo()
    }, [doctors, docId])

    useEffect(() => {
        getAvailableSlots()
    }, [docInfo])

    return docInfo && (
        <div>
            {/* ---------- Doctor Details ----------- */}
            <div className='flex flex-col sm:flex-row items-center sm:items-start gap-8'>
                <div className='relative'>
                    <div className='w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl shadow-primary/10'>
                        <img 
                            className='w-full h-full object-cover object-top' 
                            src={docInfo.image_url || doctorPlaceholder} 
                            onError={(e) => { e.target.src = doctorPlaceholder }}
                            alt={docInfo.name} 
                        />
                    </div>
                </div>

                <div className='flex-1 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-800 mx-2 sm:mx-0 mt-4 sm:mt-0 shadow-xl dark:shadow-none shadow-gray-100/50'>
                    {/* ----- Doc Info : name, degree, experience ----- */}
                    <p className='flex items-center gap-2 text-2xl font-medium text-gray-900 dark:text-slate-100'>
                        {docInfo.name} 
                        <CheckCircle className='text-primary' size={20} />
                    </p>
                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600 dark:text-slate-350'>
                        <p>{docInfo.specialization}</p>
                        <button className='py-0.5 px-2 border dark:border-slate-700 text-xs rounded-full'>{docInfo.experience} Years Experience</button>
                    </div>

                    {/* ----- Doc About ----- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-slate-100 mt-3'>
                            About <Info size={14} />
                        </p>
                        <p className='text-sm text-gray-500 dark:text-slate-400 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>

                    <p className='text-gray-500 dark:text-slate-400 font-medium mt-4'>
                        Appointment fee: <span className='text-gray-800 dark:text-slate-200'>{currencySymbol}{docInfo.fees}</span>
                    </p>
                </div>
            </div>

            {/* ------- Booking slots --------- */}
            <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700 dark:text-slate-250'>
                <p>Booking slots</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {
                        docSlots.length && docSlots.map((item, index) => (
                            <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'border border-gray-200 dark:border-slate-700 dark:text-slate-300'}`} key={index}>
                                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                <p>{item[0] && item[0].datetime.getDate()}</p>
                            </div>
                        ))
                    }
                </div>

                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {docSlots.length && docSlots[slotIndex].map((item, index) => (
                        <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 dark:text-slate-400 border border-gray-300 dark:border-slate-700'}`} key={index}>
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>
                <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 hover:bg-teal-700 hover:shadow-lg transition-all duration-300'>Book an appointment</button>
            </div>
        </div>
    )
}

export default Appointment
