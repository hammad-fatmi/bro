import React from 'react'

const services = [
  {
    title: 'Flight Booking',
    description: 'Book affordable domestic and international flights with ease.'
  },
  {
    title: 'Hotel Reservation',
    description: 'Find luxury and budget-friendly hotels for your trips.'
  },
  {
    title: 'Tour Packages',
    description: 'Explore customized travel packages for families and solo travelers.'
  },
  {
    title: 'Travel Insurance',
    description: 'Secure your journey with reliable travel insurance plans.'
  },
  {
    title: 'Visa Assistance',
    description: 'Get professional help with tourist and business visa applications.'
  },
  {
    title: '24/7 Support',
    description: 'Our support team is available anytime during your journey.'
  }
]

const Services = () => {
  return (
    <div className='min-h-screen bg-gray-100 py-10 px-5'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-4xl font-bold text-center mb-4'>
          Our Services
        </h1>

        <p className='text-center text-gray-600 mb-10'>
          We provide complete travel solutions for your next adventure.
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {services.map((service, index) => (
            <div
              key={index}
              className='bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300'
            >
              <h2 className='text-2xl font-semibold mb-3 text-blue-600'>
                {service.title}
              </h2>

              <p className='text-gray-700'>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Services