$(document).ready(function () {

    // MENÚ MOBILE

    function cerrarMenu() {
        $(".home-nav .menu").removeClass("menu-abierto");
        $(".menu-btn").text("Menú");
        $(".menu-btn").attr("aria-expanded", "false");
    }

    $(".menu-btn").on("click", function () {

        if ($(".home-nav .menu").hasClass("menu-abierto")) {
            cerrarMenu();
        } else {
            $(".home-nav .menu").addClass("menu-abierto");
            $(this).text("Cerrar");
            $(this).attr("aria-expanded", "true");
        }

    });


    // Cerrar al seleccionar una sección

    $(".home-nav .menu a").on("click", function () {
        cerrarMenu();
    });


    //Cerrar con la tecla Esc

    $(document).on("keydown", function (evento) {

        if (evento.key === "Escape" &&
            $(".home-nav .menu").hasClass("menu-abierto")) {

            cerrarMenu();
            $(".menu-btn").trigger("focus");
        }

    });


    // Restablecer el menú al pasar a Desktop

    $(window).on("resize", function () {

        if ($(window).width() > 500) {
            cerrarMenu();
        }

    });

    // ===== CARRUSEL AUTOMÁTICO DE CARTAS =====

    var pistaCartas = $(".cartas-pista");
    var ventanaCartas = $(".cartas-ventana");
    var numeroCartas = pistaCartas.children().length;

    var pausaCartas = 2000;
    var duracionCartas = 1500;
    var temporizadorCartas;

    var carruselPausado = false;
    var carruselMoviendo = false;
    var posicionCartas = 0;

    // Guardamos dos copias antes de añadirlas
    var copiaCartasUno = pistaCartas.children().clone();
    var copiaCartasDos = pistaCartas.children().clone();

    pistaCartas.append(copiaCartasUno);
    pistaCartas.append(copiaCartasDos);


    // Destacar una carta y ocultar las demás a lectores de pantalla

    function destacarCarta(posicion) {

        pistaCartas.children()
            .removeClass("carta-activa")
            .attr("aria-hidden", "true");

        pistaCartas.children().eq(posicion)
            .addClass("carta-activa")
            .attr("aria-hidden", "false");

    }


    // Centrar la primera carta de la colección intermedia

    function colocarCartas() {

        var anchoCarta = pistaCartas.children().first().outerWidth();
        var anchoVentana = ventanaCartas.width();

        posicionCartas = anchoVentana / 2
            - anchoCarta / 2
            - numeroCartas * anchoCarta;

        pistaCartas.css("left", posicionCartas);

    }


    // Esperar dos segundos antes del siguiente movimiento

    function programarCartas() {

        clearTimeout(temporizadorCartas);

        if (!carruselPausado && !document.hidden) {
            temporizadorCartas = setTimeout(
                avanzarCartas,
                pausaCartas
            );
        }

    }


    // Desplazar la fila y destacar la siguiente carta

    function avanzarCartas() {

        if (carruselPausado || document.hidden) {
            return;
        }

        carruselMoviendo = true;

        var anchoCarta = pistaCartas.children().first().outerWidth();

        destacarCarta(numeroCartas + 1);

        pistaCartas.animate(
            { left: posicionCartas - anchoCarta },
            duracionCartas,
            "swing",
            function () {

                // La primera está fuera de la pantalla:
                // la trasladamos al final sin que se vea el cambio
                pistaCartas.append(pistaCartas.children().first());

                colocarCartas();

                carruselMoviendo = false;

                // La pausa empieza cuando termina el desplazamiento
                programarCartas();

            }
        );

    }


    // Botón para pausar o continuar

    $(".cartas-pausa").on("click", function () {

        carruselPausado = !carruselPausado;

        $(this).attr("aria-pressed", String(carruselPausado));

        if (carruselPausado) {

            clearTimeout(temporizadorCartas);
            $(this).text("Reanudar carrusel");

        } else {

            $(this).text("Pausar carrusel");

            if (!carruselMoviendo) {
                programarCartas();
            }

        }

    });


    // Recalcular el centro cuando cambia el tamaño de pantalla

    $(window).on("resize", function () {

        pistaCartas.stop(true, true);
        colocarCartas();
        programarCartas();

    });


    // Evitar que siga avanzando en una pestaña oculta

    $(document).on("visibilitychange", function () {

        if (document.hidden) {

            clearTimeout(temporizadorCartas);
            pistaCartas.stop(true, true);

        } else {

            programarCartas();

        }

    });


    // Colocación inicial sin animación

    pistaCartas.addClass("cartas-colocando");

    destacarCarta(numeroCartas);
    colocarCartas();

    setTimeout(function () {
        pistaCartas.removeClass("cartas-colocando");
        programarCartas();
    }, 50);


    // ANIMACIONES AL HACER SCROLL

    AOS.init({
        duration: 650,
        once: false,
        offset: 80
    });

    // DARKRAI SECRETO EN EL FOOTER

    $(".archivo-volver").on("mouseenter focus", function () {

        var darkrai = $(".archivo-darkrai");

        if (!darkrai.hasClass("mostrar-darkrai")) {
            var esShiny = Math.random() < 0.5;

            darkrai.toggleClass("es-shiny", esShiny);
            darkrai.addClass("mostrar-darkrai");
        }

    });

    $(".archivo-volver").on("mouseleave blur", function () {

        if (!$(this).is(":hover") && !$(this).is(":focus")) {
            $(".archivo-darkrai").removeClass("mostrar-darkrai");
        }

    });
    
});