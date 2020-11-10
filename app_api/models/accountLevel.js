module.exports = (sequelize, DataTypes) => {
    return sequelize.define('accountLevel', {
        level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        accountType: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        mxnFundingDailyLimit: {
            type: DataTypes.DECIMAL(24,8),
            allowNull: false,
            defaultValue: 0
        },
        mxnWithdrawalDailyLimit: {
            type: DataTypes.DECIMAL(24,8),
            allowNull: false,
            defaultValue: 0
        },
        cashFundingDailyLimit: {
            type: DataTypes.DECIMAL(24,8),
            allowNull: false,
            defaultValue: 0
        },
        cashWithdrawalDailyLimit: {
            type: DataTypes.DECIMAL(24,8),
            allowNull: false,
            defaultValue: 0
        },
        mxnFundingMonthlyLimit: {
            type: DataTypes.DECIMAL(24,8),
            allowNull: false,
            defaultValue: 0
        },
        mxnWithdrawalMonthlyLimit: {
            type: DataTypes.DECIMAL(24,8),
            allowNull: false,
            defaultValue: 0
        },
        mxnMaxBalance: {
            type: DataTypes.DECIMAL(24,8),
            allowNull: false,
            defaultValue: 0
        },
        active: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    })
}