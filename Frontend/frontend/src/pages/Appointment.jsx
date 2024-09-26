import { useContext, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedMentors from '../components/RelatedMentors';

const Appointment = () => {
    const { mentId } = useParams();
    const { mentors, currencySymbol } = useContext(AppContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [mentInfo, setMentInfo] = useState(null);
    const [mentSlots, setMentSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    const fetchMentInfo = useCallback(async () => {
        const mentInfo = mentors.find((ment) => ment._id === mentId);
        setMentInfo(mentInfo);
    }, [mentors, mentId]); // Include mentors and mentId in dependencies

    const getAvailableSlots = async () => {
        setMentSlots([]);

        // getting current date
        let today = new Date();

        for (let i = 0; i < 7; i++) {
            // getting date with index 
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            // setting end time of the date with index
            let endTime = new Date();
            endTime.setDate(today.getDate() + i);
            endTime.setHours(21, 0, 0, 0);

            // setting hours 
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = [];

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // Add slot to array
                timeSlots.push({
                    datetime: new Date(currentDate),
                    time: formattedTime,
                });

                // Increment current time by 30 minutes
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            setMentSlots((prev) => [...prev, timeSlots]);
        }
    };

    const bookAppointment = async () => {
        const date = mentSlots[slotIndex][0].datetime;

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        console.log(slotDate, slotTime);
    };

    useEffect(() => {
        if (mentors.length > 0) {
            fetchMentInfo();
        }
    }, [mentors, fetchMentInfo]); // Include fetchMentInfo in the dependency array

    useEffect(() => {
        if (mentInfo) {
            getAvailableSlots();
        }
    }, [mentInfo]);

    return mentInfo ? (
        <div>
            {/* ---------- Mentor Details ----------- */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={mentInfo.image} alt="" />
                </div>

                <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    {/* ----- Mentor Info : name, degree, experience ----- */}
                    <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
                        {mentInfo.name}
                        <img className='w-5' src={assets.verified_icon} alt="" />
                    </p>
                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <p>{mentInfo.degree} - {mentInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{mentInfo.experience}</button>
                    </div>

                    {/* ----- Mentor About ----- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                            About <img className='w-3' src={assets.info_icon} alt="" />
                        </p>
                        <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{mentInfo.description}</p>
                    </div>
                    <p className='text-gray-500 font-medium mt-4'>
                        Designation: <span className='text-gray-600'>{mentInfo.designation}</span>
                    </p>
                    <p className='text-gray-500 font-medium mt-4'>
                        Location: <span className='text-gray-600'>{mentInfo.location}</span>
                    </p>
                    <p className='text-gray-500 font-medium mt-4'>
                        Company: <span className='text-gray-600'>{mentInfo.company}</span>
                    </p>
                    <p className='text-gray-500 font-medium mt-4'>
                        Social Media: <span className='text-gray-600'>{mentInfo.socialLinks}</span>
                    </p>
                    <p className='text-gray-500 font-medium mt-4'>
                        Skills: <span className='text-gray-600'>{mentInfo.skills}</span>
                    </p>
                    <p className='text-gray-500 font-medium mt-4'>
                        For: <span className='text-gray-600'>{mentInfo.for}</span>
                    </p><p className='text-gray-500 font-medium mt-4'>
                        TargetAudience: <span className='text-gray-600'>{mentInfo.targetAudience}</span>
                    </p>

                    <p className='text-gray-500 font-medium mt-4'>
                        Appointment fee: <span className='text-gray-600'>{currencySymbol}{mentInfo.fees}</span>
                    </p>

                </div>
            </div>

            {/* Booking slots */}
            <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
                <p>Booking slots</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {mentSlots.length && mentSlots.map((item, index) => (
                        <div
                            onClick={() => setSlotIndex(index)}
                            key={index}
                            className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
                        >
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>

                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {mentSlots.length && mentSlots[slotIndex].map((item, index) => (
                        <p
                            onClick={() => setSlotTime(item.time)}
                            key={index}
                            className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}
                        >
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                <button
                    onClick={bookAppointment}
                    className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'
                >
                    Book an appointment
                </button>
            </div>

            {/* Listing Related Mentors */}
            <RelatedMentors speciality={mentInfo.speciality} mentId={mentId} />
        </div>
    ) : null;
}

export default Appointment;
