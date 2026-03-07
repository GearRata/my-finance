import { client } from '../config/db.js'

export const listUsers = async (req, res) => {
    try {
        res.send("List")
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' })
    }
}