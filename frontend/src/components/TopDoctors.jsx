import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { Star, ArrowRight } from 'lucide-react'

const TopDoctors = () => {
    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    // Premium Circular Placeholder for Doctors
    const doctorPlaceholder = "https://static.vecteezy.com/system/resources/previews/028/250/157/non_2x/handsome-indian-doctor-ai-generative-photo.jpg"

    return (
        <div className='flex flex-col items-center gap-6 my-24 text-secondary dark:text-slate-100 md:mx-10 px-4'>
            <div className='text-center max-w-2xl'>
                <h2 className='text-4xl md:text-5xl font-extrabold tracking-tight mb-4'>Top Doctors to Book</h2>
                <p className='text-gray-500 dark:text-slate-400 text-sm md:text-base leading-relaxed'>
                    Connect with our highest-rated medical specialists. <br className='hidden sm:block' /> 
                    Our doctors are verified professionals with years of specialized experience.
                </p>
            </div>

            <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 pt-10 px-3 sm:px-0'>
                {doctors.slice(0, 10).map((item, index) => (
                    <div 
                      onClick={() => { navigate(`/appointment/${item.id}`); window.scrollTo(0, 0) }} 
                      className='group bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[2rem] p-6 cursor-pointer hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center' 
                      key={index}
                    >
                        <div className='relative mb-6'>
                            <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10 group-hover:border-primary transition-all duration-500 shadow-inner'>
                                <img 
                                    className='w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700' 
                                    src={item.image_url || doctorPlaceholder} 
                                    onError={(e) => { e.target.src = doctorPlaceholder }}
                                    alt={item.name} 
                                />
                            </div>
                            <div className='absolute -bottom-1 -right-1'>
                                <div className={`flex items-center justify-center p-1.5 rounded-full bg-white dark:bg-slate-800 shadow-md border ${item.available ? 'border-teal-100 dark:border-teal-900/30' : 'border-gray-100 dark:border-slate-700'}`}>
                                    <div className={`w-3 h-3 rounded-full ${item.available ? 'bg-teal-500 animate-pulse' : 'bg-gray-300'}`} />
                                </div>
                            </div>
                        </div>

                        <div className='p-6 flex-1 flex flex-col'>
                            <div className='flex items-center gap-1 text-amber-400 mb-2'>
                                <Star size={14} fill='currentColor' />
                                <Star size={14} fill='currentColor' />
                                <Star size={14} fill='currentColor' />
                                <Star size={14} fill='currentColor' />
                                <Star size={14} fill='currentColor' className='opacity-30' />
                                <span className='text-xs text-gray-400 dark:text-slate-400 ml-1'>4.8 (120+ Reviews)</span>
                            </div>
                            
                            <h3 className='text-gray-900 dark:text-slate-100 text-lg font-extrabold group-hover:text-primary transition-colors mb-1'>{item.name}</h3>
                            <p className='text-gray-500 dark:text-slate-400 text-sm font-medium mb-4'>{item.specialization}</p>
                            
                            <div className='mt-auto pt-4 border-t border-gray-50 dark:border-slate-700/50 flex items-center justify-between'>
                                <span className='text-xs text-gray-400 dark:text-slate-400 uppercase font-bold tracking-widest'>View Profile</span>
                                <div className='bg-accent dark:bg-slate-700 text-primary dark:text-teal-400 p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-all'>
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button 
              onClick={() => { navigate('/doctors'); window.scrollTo(0, 0) }} 
              className='group flex items-center gap-3 bg-secondary dark:bg-slate-800 text-white px-10 py-4 rounded-full mt-10 hover:bg-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-bold'
            >
                View All Doctors
                <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
            </button>
        </div>
    )
}

export default TopDoctors
