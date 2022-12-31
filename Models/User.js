const { Model } = require('../Helpers/DatabaseConnection')
const redisClient = require('../Helpers/RedisClient')
const Role = require('./Role')

class User extends Model { }

User.GetUsers = async function () {
    var checkExists = await redisClient.exists('Users')
    if (checkExists == 0) {
        await this.UpdateUserList()
    }

    let users = await redisClient.SMEMBERS('Users', 0, -1);
    users.forEach((r, index) => {
        users[index] = JSON.parse(r)
    })

    return users
}

User.UpdateUserList = async function () {
    let List = await User.findAll({
        include: {
            model: Role,
            include: this.sequelize.models.Permision
        }
    })
    await redisClient.del('Users')
    List.forEach((R) => {
        redisClient.SADD('Users', JSON.stringify(R))
    })
}

User.AddUser = async function (username, password, roles) {
    try {
        var userRoles = []
        var allRoles = await Role.GetRoleList()
        roles.forEach((ur) => {
            allRoles.forEach((r) => {
                if (r.id == ur) {
                    userRoles.push(ur);
                }
            })
        })
        var user = await User.create({ username: username, password: password })
        console.log(userRoles)
        await user.addRoles(userRoles)
        await this.UpdateUserList()
        return `Oppration successfully completed!`
    } catch (err) {
        console.log(err)
        return err
    }
}

User.UserVerification = async function (user) {
    let userList = await this.GetUsers()
    let userVerified = false
    let userId
    let userInfo
    userList.forEach((u) => {
        if (u.username == user.username && u.password == user.password) {
            userId = u.id
            userVerified = true
            userInfo = u
        }
    })

    let userRoles = []
    let userPermisions = []
    userInfo.Roles.forEach((Role) => {
        userRoles.push({ id: Role.id, RoleName: Role.RoleName })
        Role.Permisions.forEach((permision) => {
            userPermisions.push({ id: permision.id , PermisionName: permision.PermisionName})
        })
    })
  
    if (!userVerified) return { status: 403, message: 'username or password is incorrect.' }

    return { userId: userId, userRoles: userRoles, userPermisions: userPermisions}
}

module.exports = User