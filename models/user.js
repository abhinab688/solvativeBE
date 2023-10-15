let url = process.env.DATA_API
const mongodata = {
    "collection": "users",
    "database": "solvative",
    "dataSource": "Cluster0",

};

const p5MongoData = {
    "collection": "P5",
    "database": "solvative",
    "dataSource": "Cluster0",
}

async function globalConnection(data, action, filter, update) {
    const response = await fetch(url + action, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': process.env.API_KEY,
        },
        body: JSON.stringify({
            ...mongodata,
            ...data,
            ...filter,
            ...update
        }),
    });
    return response.json(); // parses JSON response into native JavaScript objects
}


exports.createUser = async (data) => {
    const reqData = {
        "document": {
            "name": data.name,
            "id": data.id,
            "P5": {
                "balance": 0,
                "history": []
            },
            "wallet": {
                "balance": 0,
                "history": []
            }
        }
    }
    const response = await globalConnection(reqData, '/insertOne', {}, {})
    return response
}

exports.findAllUsers = async () => {
    const response = await globalConnection({}, '/find', {}, {});
    return response
}

exports.getOneUser = async (id) => {
    const filter = {
        "filter": {
            "id": id
        }
    }
    const response = await globalConnection({}, '/findOne', filter, {})
    return response
}

exports.giveRewards = async (senderId, toId, amount) => {
    const filter1 = {
        "filter": {
            "id": senderId
        }
    }
    const update1 = {
        "update": {
            "$inc": {
                "P5.balance": -(+amount),
            },
            "$push": {
                "P5.history": {
                    "time": new Date(),
                    "amount": +amount,
                    "givenTo": toId
                },
            }

        }
    }

    const filter2 = {
        "filter": {
            "id": toId
        }
    }
    const update2 = {
        "update": {
            "$inc": {
                "wallet.balance": +(+amount),
            },
            "$push": {
                "wallet.history": {
                    "time": new Date(),
                    "amount": +amount,
                    "givenBy": senderId
                },
            }

        }
    }
    const response = await globalConnection({}, '/updateOne', filter1, update1)
    const response2 = await globalConnection({}, '/updateOne', filter2, update2)
    return true
}

exports.deleteRewards = async (deleterId, toDeleteId, amount, time) => {
    const filter1 = {
        "filter": {
            "id": deleterId,
        }
    }
    const update1 = {
        "update": {
            "$inc": {
                "P5.balance": +(+amount),
            },
            "$pull": {
                "P5.history": {
                    "time": time,
                    "givenTo": toDeleteId
                },
            }

        }
    }

    const filter2 = {
        "filter": {
            "id": toDeleteId
        }
    }
    const update2 = {
        "update": {
            "$inc": {
                "wallet.balance": -(+amount),
            },
            "$pull": {
                "wallet.history": {
                    "time": time,
                    "givenBy": deleterId
                },
            }

        }
    }
    const response = await globalConnection({}, '/updateOne', filter1, update1)
    const response2 = await globalConnection({}, '/updateOne', filter2, update2)
    return true
}



