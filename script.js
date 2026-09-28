// Variable global para guardar las preguntas que se van a mostrar en el examen actual
let preguntasSeleccionadas = [];

// 1. FUNCIÓN PRINCIPAL: Va al archivo JSON, descarga las preguntas y elige 20 al azar
async function iniciarSimulador() {
    try {
        // Buscamos el archivo preguntas.json que está en la misma carpeta
        const respuesta = await fetch('preguntas.json');
        const bancoCompleto = await respuesta.json();
        
        // Mezclamos TODO el banco de preguntas de forma aleatoria
        const bancoMezclado = bancoCompleto.sort(() => 0.5 - Math.random());
        
        // Elegimos las primeras 20 preguntas (aquí se define la cantidad)
        // Nota: Si en tu JSON de prueba hay menos de 20 preguntas, tomará las que existan
        const cantidadPreguntas = Math.min(20, bancoMezclado.length);
        preguntasSeleccionadas = bancoMezclado.slice(0, cantidadPreguntas);
        
        // Llamamos a la función encargada de dibujarlas en la pantalla
        dibujarPreguntas EnPantalla();
        
    } catch (error) {
        console.error("Error al cargar el examen:", error);
        document.getElementById("contenedor-quiz").innerHTML = "<p style='color:red;'>Error al cargar las preguntas. Asegúrate de tener el archivo preguntas.json en la misma carpeta.</p>";
    }
}

// 2. FUNCIÓN DE DIBUJO: Toma las preguntas seleccionadas y las mete dentro del HTML
function dibujarPreguntasEnPantalla() {
    const contenedor = document.getElementById("contenedor-quiz");
    contenedor.innerHTML = ""; // Limpiamos el texto de "Cargando..."

    preguntasSeleccionadas.forEach((pregunta, indexPregunta) => {
        // Creamos el contenedor para la pregunta individual
        let htmlPregunta = `<div class="pregunta-bloque">
            <p><strong>${indexPregunta + 1}. ${pregunta.q}</strong></p>`;
        
        // Añadimos cada una de sus opciones
        pregunta.options.forEach((opcion, indexOpcion) => {
            htmlPregunta += `
                <label>
                    <input type="radio" name="pregunta${indexPregunta}" value="${indexOpcion}">
                    ${opcion}
                </label>
            `;
        });
        
        htmlPregunta += `</div>`;
        contenedor.innerHTML += htmlPregunta; // Lo inyectamos en la carátula
    });
}

// 3. FUNCIÓN DE CALIFICACIÓN: Revisa qué marcó el usuario y calcula su nota
function revisarRespuestas() {
    let aciertos = 0;
    
    preguntasSeleccionadas.forEach((pregunta, indexPregunta) => {
        // Buscamos las opciones de esta pregunta específica
        const opciones = document.getElementsByName(`pregunta${indexPregunta}`);
        let respuestaSeleccionada = -1;
        
        // Averiguamos cuál opción dejó marcada el usuario
        for (let i = 0; i < opciones.length; i++) {
            if (opciones[i].checked) {
                respuestaSeleccionada = parseInt(opciones[i].value);
                break;
            }
        }
        
        // Si la respuesta seleccionada coincide con la correcta del JSON, sumamos un punto
        if (respuestaSeleccionada === pregunta.correct) {
            aciertos++;
        }
    });
    
    // Mostramos el resultado final en la pantalla
    const textoResultado = `Resultado: ¡Lograste ${aciertos} aciertos de ${preguntasSeleccionadas.length} preguntas!`;
    document.getElementById("resultado").innerText = textoResultado;
}

// ALERTA: Esta es la línea que "despierta" a todo el código cuando abres la página web
iniciarSimulador();