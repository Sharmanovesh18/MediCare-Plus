import React from 'react'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <div className='flex items-center gap-3 mb-5'>
                      <div className='bg-primary p-2 rounded-xl shadow-md'>
                        <div className='w-6 h-6 bg-white rounded-lg flex items-center justify-center font-bold text-primary text-xs'>M+</div>
                      </div>
                      <span className='text-2xl font-extrabold text-secondary tracking-tight'>Medicare Plus</span>
                    </div>
                    <p className='w-full md:w-2/3 text-gray-500 leading-7'>
                        Medicare Plus is a next-generation hospital management platform dedicated to precision healthcare. We bridge the gap between patients and specialized experts through seamless technology and verified medical excellence.
                    </p>
                </div>
                <div>
                    <p className='text-lg font-extrabold text-secondary mb-5 uppercase tracking-wider'>Company</p>
                    <ul className='flex flex-col gap-3 text-gray-500 font-medium'>
                        <li className='hover:text-primary cursor-pointer transition-colors'>Home</li>
                        <li className='hover:text-primary cursor-pointer transition-colors'>About us</li>
                        <li className='hover:text-primary cursor-pointer transition-colors'>Privacy policy</li>
                        <li className='hover:text-primary cursor-pointer transition-colors'>Terms of service</li>
                    </ul>
                </div>
                <div>
                    <p className='text-lg font-extrabold text-secondary mb-5 uppercase tracking-wider'>Get in touch</p>
                    <ul className='flex flex-col gap-3 text-gray-500 font-medium'>
                        <li>+91 812-234-567</li>
                        <li className='hover:text-primary cursor-pointer transition-colors underline'>support@medicareplus.com</li>
                        <li className='mt-2 text-xs text-gray-400'>Urban Estate,New Delhi</li>
                    </ul>
                </div>
            </div>
            <div className='border-t border-gray-100 pt-8 pb-10'>
                <p className='text-sm text-center text-gray-400 font-medium'>Copyright 2024 @ MedicarePlus.com - All Rights Reserved.</p>
            </div>
        </div>
    )
}

export default Footer
