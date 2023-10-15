const { findAllUsers, createUser, getOneUser, giveRewards, deleteRewards } = require('../models/user');
const { uuid: v4 } = require('uuidv4');

exports.getAllUsers = async (req, res) => {
    try {
        const data = await findAllUsers();
        res.status(200).json({ data: data.documents })
    }
    catch (err) {
        console.log(err)
    }
}

exports.createUser = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = v4();
        const data = await createUser({
            "id": userId,
            "name": name
        })
        res.status(200).json({ data: data })
    }
    catch (err) {
        console.log(err)
    }
}

exports.getOneUser = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await getOneUser(id)
        res.status(200).json({ data: response.document })
    }
    catch (err) {

    }
}

exports.giveReward = async (req, res) => {
    const userId = req.params.id;
    const { amount, toId } = req.body;
    const userData = await getOneUser(userId)
    console.log(userData)
    if (userData.document.P5.balance < amount) {
        res.status(200).json({ message: "Does not have sufficient p5", success: false })
    }
    else {
        const response = await giveRewards(userId, toId, amount)
        res.status(200).json({ message: "Success", success: true, data: response })
    }
}

exports.deleteReward = async (req, res) => {
    const deleterId = req.params.id;
    const { toDeleteId, timezone, amount } = req.body;
    const data = await deleteRewards(deleterId, toDeleteId, amount, timezone)
    res.status(200).json({ message: "success", data: data })

}