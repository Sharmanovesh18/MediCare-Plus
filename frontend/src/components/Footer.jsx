import React from 'react'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <div className='flex items-center gap-3 mb-5 select-none'>
                      <div className='bg-gradient-to-tr from-primary to-emerald-400 p-2.5 rounded-2xl shadow-md shadow-primary/10'>
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="logo-grad-foot" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#FFFFFF" />
                                    <stop offset="100%" stopColor="#A7F3D0" />
                                </linearGradient>
                            </defs>
                            <rect x="3" y="5" width="3" height="14" rx="1.5" fill="url(#logo-grad-foot)" />
                            <rect x="18" y="5" width="3" height="14" rx="1.5" fill="url(#logo-grad-foot)" />
                            <path d="M6 12H9L11 6L13 18L15 12H18" stroke="url(#logo-grad-foot)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <h2 className='text-2xl font-black text-secondary dark:text-slate-100 tracking-tight leading-none flex items-center'>
                          Medicare
                          <span className='bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent ml-1'>Plus</span>
                      </h2>
                    </div>
                    <p className='w-full md:w-2/3 text-gray-500 dark:text-slate-400 leading-7'>
                        Medicare Plus is a next-generation hospital management platform dedicated to precision healthcare. We bridge the gap between patients and specialized experts through seamless technology and verified medical excellence.
                    </p>
                </div>
                <div>
                    <p className='text-lg font-extrabold text-secondary dark:text-slate-200 mb-5 uppercase tracking-wider'>Company</p>
                    <ul className='flex flex-col gap-3 text-gray-500 dark:text-slate-400 font-medium'>
                        <li className='hover:text-primary cursor-pointer transition-colors'>Home</li>
                        <li className='hover:text-primary cursor-pointer transition-colors'>About us</li>
                        <li className='hover:text-primary cursor-pointer transition-colors'>Privacy policy</li>
                        <li className='hover:text-primary cursor-pointer transition-colors'>Terms of service</li>
                    </ul>
                </div>
                <div>
                    <p className='text-lg font-extrabold text-secondary dark:text-slate-200 mb-5 uppercase tracking-wider'>Get in touch</p>
                    <ul className='flex flex-col gap-3 text-gray-500 dark:text-slate-400 font-medium'>
                        <li>+91 812-234-567</li>
                        <li className='hover:text-primary cursor-pointer transition-colors underline'>support@medicareplus.com</li>
                        <li className='mt-2 text-xs text-gray-400 dark:text-slate-500'>Urban Estate,New Delhi</li>
                    </ul>
                </div>
            </div>
            <div className='border-t border-gray-100 dark:border-slate-800 pt-8 pb-10'>
                <p className='text-sm text-center text-gray-400 dark:text-slate-500 font-medium'>Copyright 2024 @ MedicarePlus.com - All Rights Reserved.</p>
            </div>
        </div>
    )
}

export default Footer
