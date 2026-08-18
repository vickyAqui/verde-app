const Usuario = require('./Usuario');
const Admin = require('./Admin');
const UsuarioComum = require('./UsuarioComum');
const Area = require('./Area');
const Ongs = require('./Ongs');
const Projeto = require('./Projeto');
const Denuncias = require('./Denuncias');

Usuario.hasOne(Admin, { foreignKey: 'idUsuario', as: 'admin' });
Admin.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

Usuario.hasOne(UsuarioComum, { foreignKey: 'idUsuario', as: 'comum' });
UsuarioComum.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

Usuario.hasOne(Ongs, { foreignKey: 'idUsuario', as: 'ong' });
Ongs.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

Usuario.hasMany(Projeto, { foreignKey: 'idUsuario', as: 'projetos' });
Projeto.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

Usuario.hasMany(Denuncias, { foreignKey: 'idUsuario', as: 'denuncias' });
Denuncias.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

Area.hasMany(Denuncias, { foreignKey: 'idArea', as: 'denuncias' });
Denuncias.belongsTo(Area, { foreignKey: 'idArea', as: 'area' });

module.exports = { Usuario, Admin, UsuarioComum, Area, Ongs, Projeto, Denuncias };
