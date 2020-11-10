module.exports = (sequelize, DataTypes) => {
    return sequelize.define('transaction', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        operation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        method: {
            type: DataTypes.STRING,
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'MXN'
        },
        amount: {
            type: DataTypes.DECIMAL(24,8),
            allowNull: false,
            defaultValue: 0
        },
        fees: {
            type: DataTypes.DECIMAL(24,8),
            allowNull: false,
            defaultValue: 0
        },
        tax: {
            type: DataTypes.DECIMAL(24,8),
            allowNull: false,
            defaultValue: 0
        },
        fromUserId: {
            type: DataTypes.INTEGER,
            allowNull: true,            
        },
        toUserId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        fromAccount: {
            type: DataTypes.STRING,
            allowNull: true
        },
        toAccount: {
            type: DataTypes.STRING,
            allowNull: true
        },
        txHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending'
        },
        concept: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reference: {
            type: DataTypes.STRING,
            allowNull: true
        },
        trackingKey: {
            type: DataTypes.STRING,
            allowNull: true
        }

    })
}