const Usuario = require('./Usuario');
const Area = require('./Area');
const Denuncia = require('./Denuncia');
const Nivel_Usuario = require('./Nivel_Usuario')
const Tipo_Conteudo = require('./Tipo_Conteudo');
const Conteudo = require('./Conteudo');

Nivel_Usuario.hasMany(Usuario, { foreignKey: 'idNivel_Usuario', as: 'usuarios' });
Usuario.belongsTo(Nivel_Usuario, { foreignKey: 'idNivel_Usuario', as: 'nivel' });

Usuario.hasMany(Denuncia, { foreignKey: 'idUsuario', as: 'denuncias' });
Denuncia.belongsTo(Usuario, { foreignKey: 'idUsuario', as: 'usuario' });

Area.hasMany(Denuncia, { foreignKey: 'idArea', as: 'denuncias' });
Denuncia.belongsTo(Area, { foreignKey: 'idArea', as: 'area' });

Tipo_Conteudo.hasMany(Conteudo, { foreignKey: 'idTipo_Conteudo', as: 'conteudos' });
Conteudo.belongsTo(Tipo_Conteudo, { foreignKey: 'idTipo_Conteudo', as: 'tipoConteudo' });

module.exports = { Usuario, Area, Denuncia, Nivel_Usuario, Tipo_Conteudo, Conteudo };
