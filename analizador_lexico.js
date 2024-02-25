
function analizar() {
    var codigo = document.querySelector("#codigo textarea").value;
    var tabla = document.getElementById("analizar_lexico");
    tabla.innerHTML = "<tr><th>ID</th><th>LEXEMA</th><th>TOKEN</th><th>LÍNEA</th><th>COLUMNA</th></tr>";

    var lineas = codigo.split('\n');
    var id = 1;

    // Definir palabras reservadas
    var palabrasReservadas = [
        "abstract", "continue", "for", "new", "switch",
        "assert", "default", "goto", "package", "synchronized",
        "boolean", "do", "if", "private", "this",
        "break", "double", "implements", "protected", "throw",
        "byte", "else", "import", "public", "throws",
        "case", "enum", "instanceof", "return", "transient",
        "catch", "extends", "int", "short", "try",
        "char", "final", "interface", "static", "void",
        "class", "finally", "long", "strictfp", "volatile",
        "const", "float", "native", "super", "while"
    ];

    // Ejecutar análisis léxico
    lineas.forEach(function (linea, indiceLinea) {
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
            } else if (caracter === ';' || caracter === '{' || caracter === '}') { // Delimitadores
                if (lexema !== "") {
                    agregarTokenATabla(id, lexema, tipo, indiceLinea + 1, columnaActual);
                    id++;
                }
                lexema = caracter;
                tipo = "DELIMITADOR";
                agregarTokenATabla(id, lexema, tipo, indiceLinea + 1, columnaActual); // Incrementa columna solo para delimitadores
                id++;
                lexema = "";
                tipo = "";
                columnaActual++; // Incrementa columna
            } else if (caracter === '/') { // Comentarios
                if (lexema !== "") {
                    agregarTokenATabla(id, lexema, tipo, indiceLinea + 1, columnaActual);
                    id++;
                }
                lexema = caracter;
                tipo = "COMENTARIO";
                agregarTokenATabla(id, lexema, tipo, indiceLinea + 1, columnaActual);
                id++;
                lexema = "";
                tipo = "";
                columnaActual++;
            } else if (caracter.match(/[a-zA-Z_]/)) { // Identificadores y palabras reservadas
                lexema += caracter;
                tipo = palabrasReservadas.includes(lexema) ? 'PALABRA_RESERVADA' : 'IDENTIFICADOR';
            } else if (caracter.match(/\d/)) { // Números
                lexema += caracter;
                tipo = 'NUMERO';
                // Verificar si el próximo carácter no es un dígito o un punto
                if (i === linea.length - 1 || (!linea[i + 1].match(/\d/) && linea[i + 1] !== '.')) {
                    agregarTokenATabla(id, lexema, tipo, indiceLinea + 1, columnaActual);
                    id++;
                    lexema = "";
                    tipo = "";
                }
            } else if (caracter.match(/[\+\-\*\/\=]/)) { // Operadores
                lexema = caracter;
                tipo = 'OPERADOR';
                agregarTokenATabla(id, lexema, tipo, indiceLinea + 1, columnaActual);
                id++;
                lexema = "";
                tipo = "";
            } else { // Caracteres desconocidos
                // Encontró un carácter no válido, detenerse y enviar los caracteres acumulados al analizador léxico
                agregarTokenATabla(id, lexema, tipo, indiceLinea + 1, columnaActual - lexema.length);
                id++;
                lexema = "";
                tipo = "";
                i--; // Volver a leer el carácter actual en el próximo ciclo (ya que no pertenecía al token)
            }
        }

        // Enviar los caracteres restantes al analizador léxico
        if (lexema !== "") {
            agregarTokenATabla(id, lexema, tipo, indiceLinea + 1, columnaActual - lexema.length);
            id++;
            lexema = "";
            tipo = "";
        }
    });

    function agregarTokenATabla(id, lexema, tipo, linea, columna) {
        tabla.innerHTML += "<tr><td>" + id + "</td><td>" + lexema + "</td><td>" + tipo + "</td><td>" + linea + "</td><td>" + columna + "</td></tr>";
    }
}
