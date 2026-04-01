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
        <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
            <nav className='container mx-auto px-4 flex items-center justify-between'>
                
                {/* Logo Section */}
                <div 
                  onClick={() => { navigate('/'); window.scrollTo(0, 0); }} 
                  className='flex items-center gap-2 cursor-pointer group'
                >
                    <div className='bg-primary p-2 rounded-xl shadow-md group-hover:rotate-12 transition-transform duration-300'>
                        <Stethoscope className='text-white' size={24} />
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-xl font-extrabold text-secondary tracking-tight leading-none'>Medicare Plus</span>
                        <span className='text-[10px] text-primary font-bold tracking-widest uppercase'>Medical Excellence</span>
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
                            ${isActive ? 'text-primary' : 'text-secondary hover:text-primary'}
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
                            <div className='hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-accent text-primary hover:bg-primary/10 cursor-pointer transition-colors shadow-sm'>
                                <Bell size={20} />
                            </div>
                            
                            <div className='flex items-center gap-2 cursor-pointer group relative'>
                                <div className='w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary overflow-hidden hover:border-primary transition-all shadow-sm'>
                                    <User size={24} />
                                </div>
                                <ChevronDown size={16} className='text-secondary/40 group-hover:text-primary transition-colors' />
                                
                                {/* Dropdown Menu */}
                                <div className='absolute top-full right-0 mt-2 w-52 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50'>
                                    <div className='bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 overflow-hidden'>
                                        <div className='px-5 py-2 border-b border-gray-50 mb-2'>
                                            <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>Patient Portal</p>
                                            <p className='text-sm font-black text-secondary truncate'>Current User</p>
                                        </div>
                                        <p onClick={() => navigate('/my-profile')} className='px-5 py-2.5 text-sm font-semibold text-secondary hover:bg-accent hover:text-primary cursor-pointer transition-colors flex items-center gap-3'>
                                            <User size={16} /> My Settings
                                        </p>
                                        <p onClick={() => navigate('/my-appointments')} className='px-5 py-2.5 text-sm font-semibold text-secondary hover:bg-accent hover:text-primary cursor-pointer transition-colors flex items-center gap-3'>
                                            <Activity size={16} /> Appointments
                                        </p>
                                        <hr className='my-2 border-gray-50 mx-5' />
                                        <p onClick={logout} className='px-5 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 cursor-pointer transition-colors flex items-center gap-3'>
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
                              className='text-secondary hover:text-primary font-bold text-sm px-4 py-2 transition-all'
                            >
                                Login
                            </button>
                            <button 
                              onClick={() => navigate('/login')} 
                              className='bg-secondary text-white px-8 py-2.5 rounded-2xl text-sm font-bold shadow-xl shadow-secondary/20 hover:bg-primary hover:-translate-y-1 active:translate-y-0 transition-all duration-300'
                            >
                                Get Started
                            </button>
                        </div>
                    )}
                    
                    {/* Mobile Toggle */}
                    <button 
                      onClick={() => setShowMenu(true)} 
                      className='p-3 rounded-xl bg-accent text-primary md:hidden hover:bg-primary/10 transition-colors shadow-sm'
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 z-[60] bg-white transition-all duration-500 ease-in-out transform ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className='flex items-center justify-between px-6 py-6 border-b border-gray-50'>
                        <div className='flex items-center gap-2'>
                            <div className='bg-primary p-2 rounded-xl'>
                                <Stethoscope className='text-white' size={24} />
                            </div>
                            <span className='text-xl font-black text-secondary'>Medicare Plus</span>
                        </div>
                        <button onClick={() => setShowMenu(false)} className='p-2 rounded-full hover:bg-gray-100 transition-colors'>
                            <X size={32} className='text-secondary' />
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
                                ${isActive ? 'text-primary' : 'text-secondary/30 hover:text-secondary'}
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
                                className='w-full bg-accent text-secondary py-5 rounded-3xl font-black tracking-wide text-lg shadow-sm border border-secondary/5'
                            >
                                Member Login
                            </button>
                            <button 
                                onClick={() => { setShowMenu(false); navigate('/login'); }} 
                                className='w-full bg-secondary text-white py-5 rounded-3xl font-black tracking-wide text-lg shadow-2xl shadow-secondary/20'
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
