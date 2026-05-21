import React from 'react'
import { ArrowRight, UserPlus, ShieldCheck } from 'lucide-react'

const Header = () => {
    return (
        <div className='flex flex-col md:flex-row flex-wrap bg-secondary bg-gradient-to-br from-[#0F172A] to-[#0D9488] rounded-3xl px-6 md:px-10 lg:px-20 shadow-2xl overflow-hidden min-h-[500px]'>
            {/* Left Side Content */}
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-6 py-12 md:py-[8vw] z-10'>
                <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-white/90 text-xs font-semibold tracking-wide uppercase'>
                    <ShieldCheck size={14} className='text-teal-400' />
                    100% Trusted Medical Network
                </div>
                
                <h1 className='text-4xl md:text-5xl lg:text-7xl text-white font-extrabold leading-[1.1] tracking-tight'>
                    Your Health <br /> 
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-white'>Our Priority</span>
                </h1>
                
                <div className='flex flex-col md:flex-row items-center gap-4 text-white/80 text-base font-light max-w-lg'>
                    <div className='flex -space-x-3'>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className='w-10 h-10 rounded-full border-2 border-secondary bg-gray-200 flex items-center justify-center overflow-hidden hover:scale-110 transition-all duration-300'>
                                <img src={`/patients/patient${i}.png`} alt={`Patient ${i}`} className='w-full h-full object-cover' />
                            </div>
                        ))}
                    </div>
                    <p className='text-sm md:text-base leading-relaxed'>
                        Join 10k+ patients who trust our network for <br className='hidden sm:block' /> 
                        premium healthcare and instant booking.
                    </p>
                </div>
                
                <div className='flex flex-wrap gap-4 mt-4'>
                    <a href='#speciality' className='group flex items-center gap-3 bg-white px-8 py-4 rounded-2xl text-secondary font-bold text-sm hover:bg-teal-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300'>
                        Book Appointment 
                        <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                    </a>
                    <a href='#doctors' className='flex items-center gap-2 bg-transparent border-2 border-white/30 px-8 py-4 rounded-2xl text-white font-bold text-sm hover:bg-white/10 transition-all duration-300'>
                        Explore Doctors
                    </a>
                </div>
            </div>

            {/* Right Side Image */}
            <div className='md:w-1/2 relative flex justify-end items-end'>
                <div className='absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent z-0'></div>
                <img 
                  className='w-full max-w-lg md:absolute bottom-0 h-auto rounded-b-lg drop-shadow-[0_20px_50px_rgba(13,148,136,0.3)] z-10' 
                  src='https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg' 
                  alt='Professional Doctor' 
                />
                
                {/* Decorative Elements */}
                <div className='absolute top-20 right-10 w-24 h-24 bg-teal-400/20 rounded-full blur-3xl animate-pulse'></div>
                <div className='absolute bottom-40 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl'></div>
            </div>
        </div>
    )
}

export default Header
