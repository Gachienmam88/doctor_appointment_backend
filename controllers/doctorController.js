import BookingSchema from "../models/BookingSchema.js";
import DoctorSchema from "../models/DoctorSchema.js";
export const updateDoctor = async (req, res) => {
    const id = req.params.id
    try {
        const updatedDoctor = await DoctorSchema.findByIdAndUpdate(id, {
            $set: req.body
        }, {
            new: true
        })
        res.status(200).json({ success: true, message: 'Successfully updated', data: updatedDoctor })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update' })
    }
}
export const deleteDoctor = async (req, res) => {
    const id = req.params.id
    try {
        await DoctorSchema.findByIdAndDelete(id
        )
        res.status(200).json({ success: true, message: 'Successfully deleted' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete' })
    }
}
export const getSingleDoctor = async (req, res) => {
    const id = req.params.id
    try {
        const doctor = await DoctorSchema.findById(id).
            populate('reviews').
            select('-password')
        res.status(200).json({ success: true, message: 'doctor founded', data: doctor })
    } catch (error) {
        res.status(500).json({ success: false, message: 'No doctor founded' })
    }
}
export const getAllDoctor = async (req, res) => {
    try {
        const { query } = req.query
        let doctors
        if (query) {
            doctors = await DoctorSchema.find({
                isApproved: 'approved', $or:
                    [{ name: { $regex: query, $options: 'i' } },
                    { specialization: { $regex: query, $options: 'i' } }
                    ]
            }).select('-password')
        } else {
            doctors = await DoctorSchema.find({ isApproved: 'approved' }).select("-password")
        }

        res.status(200).json({ success: true, message: 'Doctor founded', data: doctors })
    } catch (error) {
        res.status(500).json({ success: false, message: 'No doctor founded' })
    }
}
export const getDoctorProfile = async (req, res) => {
    const doctorId = req.userId
    try {
        const doctor = await DoctorSchema.findById(doctorId)
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' })
        }
        const { password, ...rest } = doctor._doc
        const appointment = await BookingSchema.find({ doctor: doctorId })
        res.status(200).json({
            success: true,
            message: 'Profile info is getting',
            data: { ...rest, appointment }
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong !' })
    }
}
