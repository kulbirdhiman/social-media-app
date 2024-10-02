import jwt from 'jsonwebtoken'
import User from '../models/user.mode.js'
const auth = async(req, res, next)=>{
    let token = req.cookies.jwt;
    try {
        const decoded = jwt.verify(token,process.env.SECRET)
        req.user = await User.findById(decoded.id)
        next()
    } catch (error) {
        console.log(error)
    }
}
export {auth}