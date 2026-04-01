import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { User, ShieldCheck, Mail, Lock, UserPlus } from 'lucide-react'

const Login = () => {

    const { backendUrl, token, setToken, setRole } = useContext(AppContext)
    const navigate = useNavigate()

    const [state, setState] = useState('Sign Up') // 'Sign Up' or 'Login'
    const [userRole, setUserRole] = useState('Patient') // 'Patient' or 'Admin'

    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            let response;
            
            if (userRole === 'Admin') {
                // Admin Login
                response = await axios.post(backendUrl + '/api/admin/login', { email, password })
                if (response.data.success) {
                    localStorage.setItem('token', response.data.token)
                    localStorage.setItem('role', 'admin')
                    setToken(response.data.token)
                    setRole('admin')
                    toast.success("Admin Login Successful")
                    navigate('/admin') // Redirect to admin dashboard
                } else {
                    toast.error(response.data.message)
                }
            } else {
                // Patient Flow
                if (state === 'Sign Up') {
                    response = await axios.post(backendUrl + '/api/user/register', { name, password, email })
                } else {
                    response = await axios.post(backendUrl + '/api/user/login', { password, email })
                }

                if (response.data.success) {
                    localStorage.setItem('token', response.data.token)
                    localStorage.setItem('role', 'patient')
                    setToken(response.data.token)
                    setRole('patient')
                    toast.success(state === 'Sign Up' ? "Account Created" : "Login Successful")
                } else {
                    toast.error(response.data.message)
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        if (token) {
            // Already logged in
            if (localStorage.getItem('role') === 'admin') {
                navigate('/admin')
            } else {
                navigate('/')
            }
        }
    }, [token])

    return (
        <div className='min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100'>
                
                {/* Role Switcher */}
                <div className='flex p-1 bg-accent rounded-2xl mb-8'>
                    <button 
                      onClick={() => { setUserRole('Patient'); setState('Login'); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${userRole === 'Patient' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-secondary'}`}
                    >
                        <User size={18} /> Patient
                    </button>
                    <button 
                      onClick={() => { setUserRole('Admin'); setState('Login'); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${userRole === 'Admin' ? 'bg-secondary text-white shadow-lg' : 'text-gray-400 hover:text-secondary'}`}
                    >
                        <ShieldCheck size={18} /> Admin
                    </button>
                </div>

                <div className='text-center'>
                    <h2 className='text-3xl font-extrabold text-secondary'>
                        {userRole === 'Admin' ? 'Admin Portal' : (state === 'Sign Up' ? 'Create Account' : 'Welcome Back')}
                    </h2>
                    <p className='mt-2 text-sm text-gray-500'>
                        {userRole === 'Admin' ? 'Sign in with administrative credentials' : `Please ${state === 'Sign Up' ? 'register' : 'sign in'} as a patient`}
                    </p>
                </div>

                <form className='mt-8 space-y-6' onSubmit={onSubmitHandler}>
                    <div className='rounded-md shadow-sm space-y-4'>
                        {state === 'Sign Up' && userRole === 'Patient' && (
                            <div className='relative'>
                                <User className='absolute left-3 top-3.5 text-gray-400' size={18} />
                                <input 
                                  type="text" 
                                  required 
                                  className='pl-10 w-full px-4 py-3 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-medium bg-gray-50' 
                                  placeholder="Full Name" 
                                  onChange={(e) => setName(e.target.value)} 
                                  value={name} 
                                />
                            </div>
                        )}
                        <div className='relative'>
                            <Mail className='absolute left-3 top-3.5 text-gray-400' size={18} />
                            <input 
                              type="email" 
                              required 
                              className='pl-10 w-full px-4 py-3 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-medium bg-gray-50' 
                              placeholder="Email Address" 
                              onChange={(e) => setEmail(e.target.value)} 
                              value={email} 
                            />
                        </div>
                        <div className='relative'>
                            <Lock className='absolute left-3 top-3.5 text-gray-400' size={18} />
                            <input 
                              type="password" 
                              required 
                              className='pl-10 w-full px-4 py-3 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-medium bg-gray-50' 
                              placeholder="Password" 
                              onChange={(e) => setPassword(e.target.value)} 
                              value={password} 
                            />
                        </div>
                    </div>

                    <button 
                      type="submit" 
                      className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${userRole === 'Admin' ? 'bg-secondary hover:bg-slate-800' : 'bg-primary hover:bg-teal-700'}`}
                    >
                        {userRole === 'Admin' ? 'Login to Dashboard' : (state === 'Sign Up' ? 'Register Now' : 'Sign In')}
                    </button>

                    {userRole === 'Patient' && (
                        <p className='text-center text-sm font-medium text-gray-500'>
                            {state === 'Sign Up' ? (
                                <>Already have an account? <span onClick={() => setState('Login')} className='text-primary hover:underline cursor-pointer font-bold'>Sign In</span></>
                            ) : (
                                <>Need a medical account? <span onClick={() => setState('Sign Up')} className='text-primary hover:underline cursor-pointer font-bold'>Register Here</span></>
                            )}
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}

export default Login
