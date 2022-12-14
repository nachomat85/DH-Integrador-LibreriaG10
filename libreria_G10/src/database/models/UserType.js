module.exports = (sequelize, dataTypes) => {

    let alias = "UsersType"; //nombre de tabla, del archivo en plural

    let columns = {  // columnas

        id: {
            type: dataTypes.INTEGER(10),
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: dataTypes.STRING,
        },
    };
    let config = {
        tableName: "tipo_usuario", // como se llama la base de datos
        timestamps: false//createdate
    };

    const UsersType = sequelize.define(alias, columns, config);



    return UsersType;
}

//-- tipo_usuarios
//INSERT INTO `tipo_usuarios` (id, nombre) VALUES (1,"administrador"), (2, "user");
//select * from tipo_usuarios;