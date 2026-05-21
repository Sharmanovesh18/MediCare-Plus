import React from 'react'
import { Link } from 'react-router-dom'
import { 
    Activity, 
    Baby, 
    Skull, 
    Microscope, 
    Stethoscope, 
    Brain, 
    ChevronRight,
    Users
} from 'lucide-react'

const SpecialityMenu = () => {

    const specialityData = [
        { speciality: 'General physician', icon: <Stethoscope size={32} /> },
        { speciality: 'Gynecologist', icon: <Baby size={32} /> },
        { speciality: 'Dermatologist', icon: <Microscope size={32} /> },
        { speciality: 'Pediatricians', icon: <Users size={32} /> },
        { speciality: 'Neurologist', icon: <Brain size={32} /> },
        { speciality: 'Gastroenterologist', icon: <Skull size={32} /> },
    ]

    return (
        <div id='speciality' className='flex flex-col items-center gap-6 py-24 text-secondary dark:text-slate-100'>
            <div className='flex flex-col items-center text-center max-w-2xl px-4'>
                <span className='px-4 py-1.5 bg-accent dark:bg-slate-800 text-primary dark:text-teal-400 text-xs font-bold rounded-full uppercase tracking-widest mb-4'>Categories</span>
                <h2 className='text-4xl md:text-5xl font-extrabold tracking-tight mb-4'>Find by Speciality</h2>
                <p className='text-gray-500 dark:text-slate-400 text-sm md:text-base leading-relaxed'>
                    Explore our diverse network of specialized medical professionals. <br className='hidden sm:block' /> 
                    Choose a category to find the perfect expert for your healthcare needs.
                </p>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-10 px-4 w-full max-w-6xl'>
                {specialityData.map((item, index) => (
                    <Link 
                      onClick={() => window.scrollTo(0, 0)} 
                      key={index} 
                      className='group flex flex-col items-center p-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl cursor-pointer hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500' 
                      to={`/doctors/${item.speciality}`}
                    >
                        <div className='w-20 h-20 bg-accent dark:bg-slate-700 text-primary dark:text-teal-400 flex items-center justify-center rounded-3xl group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm'>
                            {item.icon}
                        </div>
                        <p className='mt-4 font-bold text-center text-sm group-hover:text-primary transition-colors'>{item.speciality}</p>
                        <ChevronRight size={16} className='mt-2 opacity-0 group-hover:opacity-100 text-primary transition-all translate-y-2 group-hover:translate-y-0' />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SpecialityMenu
