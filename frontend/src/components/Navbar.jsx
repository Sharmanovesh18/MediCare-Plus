import React, { useContext, useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { LogOut, User, Menu, X, ChevronDown, Stethoscope, Bell, Activity } from 'lucide-react'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { token, setToken, role, setRole, userData } = useContext(AppContext)
    const [showMenu, setShowMenu] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Force clean up dark mode class and storage
    useEffect(() => {
        document.documentElement.classList.remove('dark')
        localStorage.removeItem('theme')
    }, [])

    // Handle scroll for glassmorphism effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        setToken("")
        setRole("")
        navigate('/login')
    }

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'All Doctors', path: '/doctors' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ]

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
            <nav className='container mx-auto px-4 flex items-center justify-between'>
                
                {/* Logo Section */}
                <div 
                  onClick={() => { navigate('/'); window.scrollTo(0, 0); }} 
                  className='flex items-center gap-3 cursor-pointer group select-none'
                >
                    <div className='relative flex items-center justify-center bg-gradient-to-tr from-primary to-emerald-400 p-2.5 rounded-2xl shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300 ease-out'>
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white animate-pulse" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animationDuration: '3s' }}>
                            <defs>
                                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#FFFFFF" />
                                    <stop offset="100%" stopColor="#A7F3D0" />
                                </linearGradient>
                            </defs>
                            <rect x="3" y="5" width="3" height="14" rx="1.5" fill="url(#logo-grad)" />
                            <rect x="18" y="5" width="3" height="14" rx="1.5" fill="url(#logo-grad)" />
                            <path d="M6 12H9L11 6L13 18L15 12H18" stroke="url(#logo-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className='absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                    </div>
                    <div className='flex flex-col'>
                        <h1 className='text-2xl font-black text-secondary dark:text-slate-100 tracking-tight leading-none flex items-center'>
                            Heal
                            <span className='bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent ml-1'>Sync</span>
                        </h1>
                        <span className='text-[8px] text-gray-400 font-bold tracking-[0.25em] uppercase mt-1 leading-none group-hover:text-primary transition-colors duration-300'>Medical Excellence</span>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <ul className='hidden md:flex items-center gap-8'>
                    {navLinks.map((link) => (
                        <NavLink 
                          key={link.path} 
                          to={link.path}
                          className={({ isActive }) => `
                            relative py-1 text-sm font-bold transition-all duration-300
                            ${isActive ? 'text-primary' : 'text-secondary dark:text-slate-300 hover:text-primary dark:hover:text-teal-400'}
                          `}
                        >
                            {({ isActive }) => (
                                <>
                                    {link.name.toUpperCase()}
                                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                                </>
                            )}
                        </NavLink>
                    ))}
                    
                    {/* Admin Shortcut for Project Presentation (Only visible to Admins) */}
                    {role === 'admin' && (
                        <NavLink to='/admin' className='text-xs font-black border-2 border-primary/20 text-primary px-4 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm'>
                            ADMIN
                        </NavLink>
                    )}
                </ul>

                {/* Right Side Actions */}
                <div className='flex items-center gap-5'>
                    


                    {token ? (
                        <div className='flex items-center gap-4'>
                            <div className='hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-accent dark:bg-slate-800 text-primary dark:text-teal-400 hover:bg-primary/10 dark:hover:bg-slate-750 cursor-pointer transition-colors shadow-sm'>
                                <Bell size={20} />
                            </div>
                            
                            <div className='flex items-center gap-2 cursor-pointer group relative'>
                                <div className='w-10 h-10 rounded-full bg-primary/10 dark:bg-teal-900/20 border-2 border-primary/20 dark:border-teal-700/30 flex items-center justify-center text-primary dark:text-teal-400 overflow-hidden hover:border-primary dark:hover:border-teal-400 transition-all shadow-sm'>
                                    <User size={24} />
                                </div>
                                <ChevronDown size={16} className='text-secondary/40 dark:text-slate-400 group-hover:text-primary transition-colors' />
                                
                                {/* Dropdown Menu */}
                                <div className='absolute top-full right-0 mt-2 w-52 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50'>
                                    <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 py-3 overflow-hidden'>
                                        <div className='px-5 py-2 border-b border-gray-50 dark:border-slate-700 mb-2'>
                                            <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>Patient Portal</p>
                                            <p className='text-sm font-black text-secondary dark:text-slate-200 truncate'>Current User</p>
                                        </div>
                                        <p onClick={() => navigate('/my-profile')} className='px-5 py-2.5 text-sm font-semibold text-secondary dark:text-slate-300 hover:bg-accent dark:hover:bg-slate-700 hover:text-primary dark:hover:text-teal-400 cursor-pointer transition-colors flex items-center gap-3'>
                                            <User size={16} /> My Settings
                                        </p>
                                        <p onClick={() => navigate('/my-appointments')} className='px-5 py-2.5 text-sm font-semibold text-secondary dark:text-slate-300 hover:bg-accent dark:hover:bg-slate-700 hover:text-primary dark:hover:text-teal-400 cursor-pointer transition-colors flex items-center gap-3'>
                                            <Activity size={16} /> Appointments
                                        </p>
                                        <hr className='my-2 border-gray-50 dark:border-slate-700 mx-5' />
                                        <p onClick={logout} className='px-5 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-colors flex items-center gap-3'>
                                            <LogOut size={16} /> Sign Out
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='hidden md:flex items-center gap-4'>
                            <button 
                              onClick={() => navigate('/login')} 
                              className='text-secondary dark:text-slate-300 hover:text-primary dark:hover:text-teal-400 font-bold text-sm px-4 py-2 transition-all'
                            >
                                Login
                            </button>
                            <button 
                              onClick={() => navigate('/login')} 
                              className='bg-secondary dark:bg-teal-600 text-white px-8 py-2.5 rounded-2xl text-sm font-bold shadow-xl shadow-secondary/20 dark:shadow-teal-900/10 hover:bg-primary dark:hover:bg-teal-500 hover:-translate-y-1 active:translate-y-0 transition-all duration-300'
                            >
                                Get Started
                            </button>
                        </div>
                    )}
                    
                    {/* Mobile Toggle */}
                    <button 
                      onClick={() => setShowMenu(true)} 
                      className='p-3 rounded-xl bg-accent dark:bg-slate-800 text-primary dark:text-teal-400 md:hidden hover:bg-primary/10 dark:hover:bg-slate-700 transition-colors shadow-sm'
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div 
                  className={`fixed inset-0 z-[60] transition-all duration-500 ease-in-out transform md:hidden bg-white dark:bg-slate-900 ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className='flex items-center justify-between px-6 py-6 border-b border-gray-50 dark:border-slate-800 select-none'>
                        <div className='flex items-center gap-3'>
                            <div className='bg-gradient-to-tr from-primary to-emerald-400 p-2 rounded-xl'>
                                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="logo-grad-mob" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#FFFFFF" />
                                            <stop offset="100%" stopColor="#A7F3D0" />
                                        </linearGradient>
                                    </defs>
                                    <rect x="3" y="5" width="3" height="14" rx="1.5" fill="url(#logo-grad-mob)" />
                                    <rect x="18" y="5" width="3" height="14" rx="1.5" fill="url(#logo-grad-mob)" />
                                    <path d="M6 12H9L11 6L13 18L15 12H18" stroke="url(#logo-grad-mob)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 className='text-xl font-black text-secondary dark:text-white tracking-tight leading-none flex items-center'>
                                Heal
                                <span className='bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent ml-1'>Sync</span>
                            </h2>
                        </div>
                        <button onClick={() => setShowMenu(false)} className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors'>
                            <X size={32} className='text-secondary dark:text-white' />
                        </button>
                    </div>
                    
                    <div className='flex flex-col gap-6 p-8'>
                        {navLinks.map((link) => (
                            <NavLink 
                              key={link.path} 
                              onClick={() => setShowMenu(false)} 
                              to={link.path}
                              className={({ isActive }) => `
                                text-3xl font-black flex items-center justify-between transition-colors
                                ${isActive ? 'text-primary' : 'text-secondary/30 dark:text-slate-650 hover:text-secondary dark:hover:text-slate-200'}
                              `}
                            >
                                {link.name}
                                <span className={`h-3 w-3 rounded-full bg-primary transition-opacity ${location.pathname === link.path ? 'opacity-100' : 'opacity-0'}`} />
                            </NavLink>
                        ))}
                    </div>
                    
                    {!token && (
                        <div className='px-8 mt-auto mb-12 flex flex-col gap-4'>
                            <button 
                                onClick={() => { setShowMenu(false); navigate('/login'); }} 
                                className='w-full bg-accent dark:bg-slate-800 text-secondary dark:text-slate-300 py-5 rounded-3xl font-black tracking-wide text-lg shadow-sm border border-secondary/5 dark:border-slate-700'
                            >
                                Member Login
                            </button>
                            <button 
                                onClick={() => { setShowMenu(false); navigate('/login'); }} 
                                className='w-full bg-secondary dark:bg-teal-600 text-white py-5 rounded-3xl font-black tracking-wide text-lg shadow-2xl shadow-secondary/20 dark:shadow-teal-900/20 hover:bg-primary dark:hover:bg-teal-500'
                            >
                                Sign Up Now
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar
