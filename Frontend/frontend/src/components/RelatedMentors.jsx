import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types' // Import PropTypes
import { AppContext } from '../context/AppContext'

const RelatedMentors = ({ speciality, mentId }) => {
    const navigate = useNavigate()
    const { mentors } = useContext(AppContext)

    const [relMent, setRelMent] = useState([])

    useEffect(() => {
        if (mentors.length > 0 && speciality) {
            const mentorsData = mentors.filter((ment) => ment.speciality === speciality && ment._id !== mentId)
            setRelMent(mentorsData)
        }
    }, [mentors, speciality, mentId])

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900'>
            <h1 className='text-3xl font-medium'>Related Mentors</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted mentors.</p>
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {relMent.map((item, index) => (
                    <div
                        onClick={() => {
                            navigate(`/appointment/${item._id}`)
                            window.scrollTo(0, 0)
                        }}
                        className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500'
                        key={index}
                    >
                        <img className='bg-blue-100 w-full h-48 object-cover' src={item.image} alt={item.name || "Mentor"} />
                        <div className='p-4'>
                            <div className='flex items-center gap-2 text-sm text-green-500'>
                                <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                            </div>
                            <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                            <p className='text-gray-600 text-sm'>{item.category}</p>
                            <p className='text-gray-600 text-sm'>{item.designation}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Define PropTypes for the component
RelatedMentors.propTypes = {
    speciality: PropTypes.string.isRequired, // Expecting a string for speciality
    mentId: PropTypes.string.isRequired      // Expecting a string for mentId
}

export default RelatedMentors
