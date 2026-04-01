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
      <p className='text-gray-600 font-light'>Browse through the specialist doctors.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button className={`py-1 px-3 border rounded text-sm  transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={() => setShowFilter(prev => !prev)}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black " : ""}`}>General physician</p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black " : ""}`}>Gynecologist</p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black " : ""}`}>Dermatologist</p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black " : ""}`}>Pediatricians</p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black " : ""}`}>Neurologist</p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black " : ""}`}>Gastroenterologist</p>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {
            filterDoc.map((item, index) => (
              <div onClick={() => { navigate(`/appointment/${item.id}`); window.scrollTo(0, 0) }} className='group bg-white border border-gray-100 rounded-[2rem] p-6 cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center' key={index}>
                <div className='relative mb-4'>
                    <div className='w-24 h-24 rounded-full overflow-hidden border-4 border-primary/10 group-hover:border-primary transition-all duration-500'>
                        <img 
                            className='w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700' 
                            src={item.image_url || doctorPlaceholder} 
                            onError={(e) => { e.target.src = doctorPlaceholder }}
                            alt={item.name} 
                        />
                    </div>
                    <div className='absolute -bottom-1 -right-1'>
                        <div className={`w-3 h-3 rounded-full ${item.available ? 'bg-teal-500' : 'bg-gray-300'} border-2 border-white`} />
                    </div>
                </div>
                <div className='flex flex-col items-center'>
                  <p className='text-gray-900 text-lg font-extrabold group-hover:text-primary transition-colors'>{item.name}</p>
                  <p className='text-primary text-xs font-bold uppercase tracking-wider mt-1'>{item.specialization}</p>
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
