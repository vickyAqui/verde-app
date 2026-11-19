const Usuario = require('./Usuario');
const Area = require('./Area');
const Denuncia = require('./Denuncia');
const Nivel_Usuario = require('./Nivel_Usuario')

Nivel_Usuario.hasMany(Usuario, { foreignKey: 'idNivel_Usuario', as: 'usuarios' });
Usuario.belongsTo(Nivel_Usuario, { foreignKey: 'idNivel_Usuario', as: 'nivel' });

Usuario.hasMany(Denuncia, { foreignKey: 'idUsuario', as: 'denuncias' });
Denuncia.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

Area.hasMany(Denuncia, { foreignKey: 'idArea', as: 'denuncias' });
Denuncia.belongsTo(Area, { foreignKey: 'idArea', as: 'area' });

module.exports = { Usuario, Area, Denuncia, Nivel_Usuario };
