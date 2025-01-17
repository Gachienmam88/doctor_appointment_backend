import jwt from 'jsonwebtoken'
import DoctorSchema from '../models/DoctorSchema.js'
import UserSchema from '../models/UserSchema.js'
export const authenticate = async (req, res, next) => {
    //get token from headers
    const authToken = req.headers.authorization
    // Check token is exist
    if (!authToken || !authToken.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token , authorization denied ' })
    }
    try {
        const token = authToken.split(' ')[1]
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.userId = decoded.id
        req.role = decoded.role

        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token is expired' })
        }
        return res.status(401).json({ success: false, message: 'Invalid token' })
    }
}
export const restrict = (roles) => async (req, res, next) => {
    const UserId = req.userId
    let user
    const patient = await UserSchema.findById(UserId)
    const doctor = await DoctorSchema.findById(UserId)
    if (patient) {
        user = patient
    }
    if (doctor) {
        user = doctor
    }
    if (!roles.includes(user.role)) {
        return res.status(401).json({ success: false, message: 'You are not authorization' })
    }
    next()
}
