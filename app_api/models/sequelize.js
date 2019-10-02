const Sequelize = require('sequelize')
const AccountLevelModel = require('./accountLevel')
const AccountTypeModel = require('./accountType')
const SepomexModel = require('./sepomex')
const AuthRequestModel = require('./authRequest')
const UserModel = require('./user')
const UserProfileModel = require('./userProfile')
const DocumentModel = require('./document')
const LocationModel = require('./location')
const AddressModel = require('./address')
const TransactionModel = require('./transaction')
const FeesModel = require('./fees')
const BalanceModel = require('./balance')
const AssetModel = require('./asset')
const CompanyProfileModel = require('./companyProfile')
const PlatformVersionModel = require('./platformVersion')
const DeviceFingerprintModel = require('./deviceFingerprint')
const SessionModel = require('./session')
const TwoFactorAuthModel = require('./twoFactorAuth')
const SecurityQuestionModel = require('./securityQuestion')
const ContactModel = require('./contact')
const CardModel = require('./card')
const FundsAccountModel = require('./fundsAccount')


// pld
const PersonaBloqueadaModel = require('./personaBloqueada')
const PersonaSancionadaModel = require('./personaSancionada')
const PersonaBoletinadaModel = require('./personaBoletinada')
const PEPsModel = require('./peps')
const MatrizRiesgoModel = require('./matrizRiesgo')
const RiesgoClienteModel = require('./riesgoCliente')
const UnusualOperationModel = require('./unusualOperation')
const ReporteModel = require('./reporte')
const OperacionReporteModel = require('./operacionReporte')

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

const User = UserModel(sequelize, Sequelize)
const UserProfile = UserProfileModel(sequelize, Sequelize)
const Document = DocumentModel(sequelize, Sequelize)
const Location = LocationModel(sequelize, Sequelize)
const Address = AddressModel(sequelize, Sequelize)
const Transaction = TransactionModel(sequelize, Sequelize)
const Fees = FeesModel(sequelize, Sequelize)
const Balance = BalanceModel(sequelize, Sequelize)
const CompanyProfile = CompanyProfileModel(sequelize, Sequelize)
const DeviceFingerprint = DeviceFingerprintModel(sequelize, Sequelize)
const Session = SessionModel(sequelize, Sequelize)
const TwoFactorAuth = TwoFactorAuthModel(sequelize, Sequelize)
const SecurityQuestion = SecurityQuestionModel(sequelize, Sequelize)
const Contact = ContactModel(sequelize, Sequelize)
const Card = CardModel(sequelize, Sequelize)
const FundsAccount = FundsAccountModel(sequelize, Sequelize)

const AuthRequest = AuthRequestModel(sequelize, Sequelize)

const Asset = AssetModel(sequelize, Sequelize)
const Sepomex = SepomexModel(sequelize, Sequelize)
const AccountLevel = AccountLevelModel(sequelize, Sequelize)
const AccountType = AccountTypeModel(sequelize, Sequelize)
const PlatformVersion = PlatformVersionModel(sequelize, Sequelize)

// pld
const PersonaBloqueada = PersonaBloqueadaModel(sequelize, Sequelize)
const PersonaSancionada = PersonaSancionadaModel(sequelize, Sequelize)
const PersonaBoletinada = PersonaBoletinadaModel(sequelize, Sequelize)
const PEPs = PEPsModel(sequelize, Sequelize)
const MatrizRiesgo = MatrizRiesgoModel(sequelize, Sequelize)
const RiesgoCliente = RiesgoClienteModel(sequelize, Sequelize)
const UnusualOperation = UnusualOperationModel(sequelize, Sequelize)
const Reporte = ReporteModel(sequelize, Sequelize)
const OperacionReporte = OperacionReporteModel(sequelize, Sequelize)

User.hasOne(CompanyProfile)

User.hasMany(Document)
User.hasMany(Address)
User.hasMany(Location)
User.hasMany(Transaction)
User.hasMany(Fees)
User.hasMany(Balance)
User.hasMany(DeviceFingerprint)
User.hasMany(Session)
User.hasMany(Contact)
User.hasMany(Card)
User.hasMany(FundsAccount)
User.hasOne(UserProfile)
User.hasOne(CompanyProfile)
User.hasOne(TwoFactorAuth)
User.hasOne(SecurityQuestion)
UserProfile.belongsTo(User)
AuthRequest.belongsTo(User)
Balance.hasOne(Asset)

// pld
User.hasMany(RiesgoCliente)
UnusualOperation.belongsTo(User)
UnusualOperation.belongsTo(RiesgoCliente)
Reporte.hasMany(OperacionReporte)
OperacionReporte.belongsTo(Reporte)


sequelize.sync({force: false})
    .then(() => {
        console.log('Database & tables created')
    })

module.exports = {
    User,
    AccountLevel,
    AccountType,    
    Sepomex,
    AuthRequest,
    Location,
    Address,
    UserProfile,
    Document,
    Transaction,
    Fees,
    Balance,
    CompanyProfile,
    Asset,
    PlatformVersion,
    DeviceFingerprint,
    Session,
    TwoFactorAuth,
    SecurityQuestion,
    Contact,
    Card,
    FundsAccount,    
    sequelize,
    // pld
    PersonaBloqueada,
    PersonaSancionada,
    PersonaBoletinada,
    PEPs,
    MatrizRiesgo,
    RiesgoCliente,
    UnusualOperation,
    Reporte,
    OperacionReporte
}