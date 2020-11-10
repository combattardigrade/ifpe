module.exports = (sequelize, DataTypes) => {
    return sequelize.define('deviceFingerprint', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ipCountry: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ipRegion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ipTimezone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ipCity: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ipLat: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ipLng: {
            type: DataTypes.STRING,
            allowNull: true
        },
        device: {
            type: DataTypes.STRING,
            allowNull: true
        },
        browser: {
            type: DataTypes.STRING,
            allowNull: true
        },
        operatingSystem: {
            type: DataTypes.STRING,
            allowNull: true
        },
        vendor: {
            type: DataTypes.STRING,
            allowNull: true
        },
        screenWidth: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        screenHeight: {
            type: DataTypes.STRING,
            allowNull: true
        },
        viewportWidth: {
            type: DataTypes.STRING,
            allowNull: true
        },
        viewportHeight: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userAgent: {
            type: DataTypes.STRING,
            allowNull: true
        },
        authorized: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    })
}