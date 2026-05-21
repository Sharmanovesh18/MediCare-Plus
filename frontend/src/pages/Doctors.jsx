import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {

  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)

  // Premium Circular Placeholder for Doctors
  const doctorPlaceholder = "https://static.vecteezy.com/system/resources/previews/028/250/157/non_2x/handsome-indian-doctor-ai-generative-photo.jpg"

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.specialization === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div>
      <p className='text-gray-600 dark:text-slate-350 font-light'>Browse through the specialist doctors.</p>
      
      {/* Mobile Speciality Pills (Horizontal scroll) */}
      <div className='flex sm:hidden gap-2.5 overflow-x-auto w-full py-3 scrollbar-none select-none'>
          {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'].map((spec) => (
              <button
                  key={spec}
                  onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
                  className={`whitespace-nowrap px-4 py-2 text-xs font-bold rounded-full border-2 transition-all duration-300 ${speciality === spec ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-white dark:bg-slate-800 text-secondary/60 dark:text-slate-300 border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600'}`}
              >
                  {spec}
              </button>
          ))}
      </div>

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5 w-full'>
        {/* Desktop Sidebar Filters */}
        <div className='hidden sm:flex flex-col gap-4 text-sm text-gray-600 dark:text-slate-300 min-w-[200px]'>
          {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'].map((spec) => (
              <p
                  key={spec}
                  onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
                  className={`pl-3 py-2 pr-12 border border-gray-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer font-semibold hover:bg-accent dark:hover:bg-slate-800 hover:text-primary dark:hover:text-teal-400 ${speciality === spec ? "bg-accent dark:bg-teal-950/30 text-primary dark:text-teal-400 border-primary/30 dark:border-teal-500/30" : ""}`}
              >
                  {spec}
              </p>
          ))}
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {
            filterDoc.map((item, index) => (
              <div onClick={() => { navigate(`/appointment/${item.id}`); window.scrollTo(0, 0) }} className='group bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[2rem] p-6 cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center' key={index}>
                <div className='relative mb-4'>
                    <div className='w-24 h-24 rounded-full overflow-hidden border-4 border-primary/10 dark:border-teal-950 group-hover:border-primary dark:group-hover:border-teal-400 transition-all duration-500 shadow-sm'>
                        <img 
                            className='w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700' 
                            src={item.image_url || doctorPlaceholder} 
                            onError={(e) => { e.target.src = doctorPlaceholder }}
                            alt={item.name} 
                        />
                    </div>
                    <div className='absolute -bottom-1 -right-1'>
                        <div className={`w-3.5 h-3.5 rounded-full ${item.available ? 'bg-teal-500 animate-pulse' : 'bg-gray-300'} border-2 border-white dark:border-slate-800`} />
                    </div>
                </div>
                <div className='flex flex-col items-center'>
                  <p className='text-gray-900 dark:text-slate-100 text-lg font-extrabold group-hover:text-primary transition-colors'>{item.name}</p>
                  <p className='text-primary dark:text-teal-400 text-xs font-bold uppercase tracking-wider mt-1'>{item.specialization}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Doctors
