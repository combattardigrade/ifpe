const Sequelize = require('sequelize')
const AccountLevelModel = require('./accountLevel')
const AccountTypeModel = require('./accountType')
const UserAddressModel = require('./userAddress')
const SepomexModel = require('./sepomex')
const AuthRequestModel = require('./authRequest')
const UserModel = require('./user')

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
)


const AccountLevel = AccountLevelModel(sequelize, Sequelize)
const AccountType = AccountTypeModel(sequelize, Sequelize)
const User = UserModel(sequelize, Sequelize)
const UserAddress = UserAddressModel(sequelize, Sequelize)
const Sepomex = SepomexModel(sequelize, Sequelize)
const AuthRequest = AuthRequestModel(sequelize, Sequelize)


User.hasOne(UserAddress)
AuthRequest.belongsTo(User)

sequelize.sync({force: false})
    .then(() => {
        console.log('Database & tables created')
    })

module.exports = {
    User,
    AccountLevel,
    AccountType,
    UserAddress,
    Sepomex,
    AuthRequest,
    sequelize
}