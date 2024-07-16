import Review from '../models/ReviewSchema.js'
import DoctorSchema from '../models/DoctorSchema.js'
import UserSchema from '../models/UserSchema.js'
//get all reviews
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
        res.status(200).json({ success: true, message: 'Successfully', data: reviews })
    } catch (error) {
        res.status(404).json({ success: false, message: 'Not Found' })
    }
}
//create review 
export const createReview = async (req, res) => {
    if (!req.body.DoctorSchema) {
        req.body.doctor = req.params.doctorId
    }
    if (!req.body.UserSchema) {
        req.body.user = req.userId
    }
    const newReview = new Review(req.body)
    try {
        const saveReview = await newReview.save()
        await DoctorSchema.findByIdAndUpdate(req.params.doctorId, {
            $push: { reviews: saveReview._id }
        })
        res.status(200).json({ success: true, message: 'Review submitted', data: saveReview })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}