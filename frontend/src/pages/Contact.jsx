import React from 'react'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[360px]' src="https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827775.jpg" alt="" />
        <div className='flex flex-col justify-center items-start gap-6 '>
          <p className='font-semibold text-lg text-gray-600'>OUR OFFICE</p>
          <p className='text-gray-500'>54709 Williams Station <br /> Suite 350, Washington, USA</p>
          <p className='text-gray-500'>Tel: (415) 555-0132 <br /> Email: admin@prescripto.com</p>
          <p className='font-semibold text-lg text-gray-600'>CAREERS AT PRESCRIPTO</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}

export default Contact
