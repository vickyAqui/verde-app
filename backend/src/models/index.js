const User = require('./User');
const Area = require('./Area');
const NGO = require('./NGO');
const Notification = require('./Notification');
const Connection = require('./Connection');

User.hasMany(Area, { foreignKey: 'reportedBy', as: 'reportedAreas' });
Area.belongsTo(User, { foreignKey: 'reportedBy', as: 'reporter' });

NGO.hasMany(Area, { foreignKey: 'ngoId', as: 'areas' });
Area.belongsTo(NGO, { foreignKey: 'ngoId', as: 'ngo' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.belongsToMany(NGO, { through: Connection, foreignKey: 'userId', as: 'connectedNGOs' });
NGO.belongsToMany(User, { through: Connection, foreignKey: 'ngoId', as: 'connectedUsers' });

Connection.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Connection.belongsTo(NGO, { foreignKey: 'ngoId', as: 'ngo' });
Connection.belongsTo(Area, { foreignKey: 'areaId', as: 'area' });

module.exports = { User, Area, NGO, Notification, Connection };
