import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, UserPlus } from 'lucide-react'

const Banner = () => {

    const navigate = useNavigate()

    return (
        <div className='relative flex flex-col md:flex-row bg-secondary bg-gradient-to-br from-[#0F172A] to-[#0D9488] rounded-3xl px-6 sm:px-10 md:px-14 lg:px-12 my-24 md:mx-10 shadow-2xl overflow-hidden'>
            
            {/* Decorative background pattern */}
            <div className='absolute inset-0 opacity-10 pointer-events-none'>
                <div className='absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-[100px]'></div>
                <div className='absolute bottom-0 right-0 w-96 h-96 bg-teal-400/20 rounded-full blur-[120px]'></div>
            </div>

            {/* ------- Left Side ------- */}
            <div className='flex-1 py-12 sm:py-16 md:py-24 lg:py-32 lg:pl-10 z-10'>
                <div className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight'>
                    <p>Book Appointment</p>
                    <p className='mt-2 text-teal-300'>With 100+ Trusted Doctors</p>
                </div>
                <p className='mt-6 text-white/70 max-w-md text-sm md:text-base leading-relaxed'>
                    Join thousands of satisfied patients who have found their perfect healthcare partners through our platform. Instant booking, verified reviews, and top-tier care.
                </p>
                
                <div className='flex flex-wrap gap-4 mt-8'>
                    <button 
                      onClick={() => { navigate('/login'); window.scrollTo(0, 0) }} 
                      className='group flex items-center gap-3 bg-white text-secondary px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-teal-50 hover:-translate-y-1 transition-all duration-300'
                    >
                        Get Started
                        <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                    </button>
                    <div className='flex items-center gap-2 text-white/90 text-sm font-semibold px-4'>
                        <div className='flex -space-x-2'>
                            <div className='w-8 h-8 rounded-full border-2 border-primary bg-teal-400 flex items-center justify-center p-1.5'><UserPlus size={14} /></div>
                            <div className='w-8 h-8 rounded-full border-2 border-primary bg-teal-300 flex items-center justify-center p-1.5'><UserPlus size={14} /></div>
                            <div className='w-8 h-8 rounded-full border-2 border-primary bg-teal-200 flex items-center justify-center p-1.5'><UserPlus size={14} /></div>
                        </div>
                        <span>Join 10k+ Users</span>
                    </div>
                </div>
            </div>

            {/* ------- Right Side ------- */}
            <div className='hidden md:block md:w-1/2 relative min-h-[400px]'>
                <img 
                  className='absolute bottom-0 right-0 w-full max-w-md drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10' 
                  src='https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827775.jpg' 
                  alt='Medical Professional' 
                />
            </div>
        </div>
    )
}

export default Banner
