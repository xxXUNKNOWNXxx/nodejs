import User from '../../Models/User.js'
import IpRateLimit from '../../Middlewares/IpRateLimitter.js'
import express from 'express'
const router = express.Router()

router.post('/', IpRateLimit, async (req, res) => {
    const { username, password, roles } = req.body
    if (!username || !password) return res.sendStatus(400)
    if (!roles || roles.length == 0) return res.status(400).json({ message: 'define an array of role Ids for this user' })
    let message = await User.AddUser(username, password, roles)
    res.json({ message: message })
})

export default router
