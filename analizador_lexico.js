function analizar() {
    var codigo = document.querySelector("#codigo textarea").value;
    var tabla = document.getElementById("analizar_lexico");
    tabla.innerHTML = "<tr><th>ID</th><th>LEXEMA</th><th>TOKEN</th><th>LÍNEA</th><th>COLUMNA</th></tr>";

    var lineas = codigo.split('\n');
    var id = 1;

    // Definir palabras reservadas
    var palabrasReservadas = ["if", "else", "while", "for", "function", "var", "let", "const"];

    // Ejecutar análisis léxico
    lineas.forEach(function(linea, indiceLinea) {
        var columnaActual = 1;
        var lexema = "";
        var tipo = "";

        for (var i = 0; i < linea.length; i++) {
            var caracter = linea[i];
            if (caracter.match(/\s/)) {  // Ignorar espacios en blanco
                if (lexema !== "") {
                    // Agregar lexema a la tabla
                    agregarTokenATabla(id, lexema, tipo, indiceLinea + 1, columnaActual);
                    id++;
                    lexema = "";
                    tipo = "";
                }
                columnaActual++;
            } else {
                if (caracter.match(/[a-zA-Z_]/)) {
                    lexema += caracter;
                    tipo = palabrasReservadas.includes(lexema) ? 'RESERVADA' : 'IDENTIFICADOR';
                } else if (caracter.match(/\d/)) {
                    lexema += caracter;
                    tipo = 'NUMERO';
                    // Verificar si el próximo carácter no es un dígito o un punto
                    if (i === linea.length - 1 || (!linea[i + 1].match(/\d/) && linea[i + 1] !== '.')) {
                        agregarTokenATabla(id, lexema, tipo, indiceLinea + 1, columnaActual);
                        id++;
                        lexema = "";
                        tipo = "";
                    }
                } else if (caracter === '.') {
                    // Verificar si el lexema actual es un número con decimales (double o float)
                    if (tipo === 'NUMERO' && linea[i + 1].match(/\d/)) {
                        lexema += caracter;
                        tipo = 'DOUBLE';
                    } else {
                        // Tratar el punto como un operador si no se sigue de un dígito
                        lexema = caracter;
                        tipo = 'OPERADOR';
                        agregarTokenATabla(id, lexema, tipo, indiceLinea + 1, columnaActual);
                        id++;
                        lexema = "";
                        tipo = "";
                    }
                } else if (caracter.match(/[\;\+\-\*\/\=\;]/)) {
                    lexema = caracter;
                    tipo = 'OPERADOR';
                    agregarTokenATabla(id, lexema, tipo, indiceLinea + 1, columnaActual);
                    id++;
                    lexema = "";
                    tipo = "";
                } else {
                    lexema += caracter;
                    tipo = 'DESCONOCIDO';
                }
                if (i === linea.length - 1 || linea[i + 1].match(/\s/)) {
                    // Si el próximo carácter es espacio en blanco, agregar lexema a la tabla
                    if (lexema !== "") {
                        agregarTokenATabla(id, lexema, tipo, indiceLinea + 1, columnaActual);
                        id++;
                        lexema = "";
                        tipo = "";
                    }
                }
            }
        }
    });

    function agregarTokenATabla(id, lexema, tipo, linea, columna) {
        tabla.innerHTML += "<tr><td>" + id + "</td><td>" + lexema + "</td><td>" + tipo + "</td><td>" + linea + "</td><td>" + columna + "</td></tr>";
    }
}
