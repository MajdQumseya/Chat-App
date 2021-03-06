const users = []

const addUser = ({id, username, room}) => {
    //Clean data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //Validate username and room
    if(!username || !room) {
        return {
            error: 'User name and Room are required'
        }
    }

    //Check for existing user
    const exisitingUser = users.find((user) => {
        return user.room === room && user.username == username
    })

    //Validate Username
    if(exisitingUser) {
        return {
            error: 'Username is in use'
        }
    }

    // Store user
    const user = {id, username, room}
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.filter((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
