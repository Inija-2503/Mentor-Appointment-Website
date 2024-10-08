import axios from "axios";
import { createContext, useState } from "react";
import PropTypes from 'prop-types'; // Import PropTypes
import { toast } from "react-toastify";


export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')

    const [appointments, setAppointments] = useState([])
    const [mentors, setMentors] = useState([])
    const [dashData, setDashData] = useState(false)

    // Getting all Mentors data from Database using API
    const getAllMentors = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/all-mentors', { headers: { aToken } })
            if (data.success) {
                setMentors(data.mentors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    // Function to change mentor availablity using API
    const changeAvailability = async (mentId) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { mentId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllMentors()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })

            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const value = {
        aToken, setAToken,
        mentors,
        getAllMentors,
        changeAvailability,
        appointments,
        getAllAppointments,
        getDashData,
        cancelAppointment,
        dashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}
AdminContextProvider.propTypes = {
    children: PropTypes.node.isRequired // Validate that children are passed and it's a valid React node
};

export default AdminContextProvider