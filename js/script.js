$(document).ready(function () {

    // ===== MENÚ MOBILE =====

    function cerrarMenu() {
    
        $(".home-nav .menu").removeClass    ("menu-abierto");
    
        $(".menu-btn")
            .attr("aria-expanded", "false")
            .attr("aria-label", "Abrir menú");
    
    }


    // Abrir o cerrar

    $(".menu-btn").on("click", function () {

        if ($(".home-nav .menu").hasClass   ("menu-abierto")) {

            cerrarMenu();

        } else {

            $(".home-nav .menu").addClass   ("menu-abierto");

            $(this)
                .attr("aria-expanded", "true")
                .attr("aria-label", "Cerrar menú");

        }

    });


    // Cerrar al seleccionar una sección

    $(".home-nav .menu a").on("click", function () {
        cerrarMenu();
    });


    // Cerrar con Escape

    $(document).on("keydown", function (evento) {

        if (
            evento.key === "Escape" &&
            $(".home-nav .menu").hasClass   ("menu-abierto")
        ) {
            cerrarMenu();
            $(".menu-btn").trigger("focus");
        }

    });


    // Cerrar al pulsar fuera

    $(document).on("click", function (evento) {

        if (!$(evento.target).closest(".home-nav").length) {
            cerrarMenu();
        }

    });


    // Restablecer al pasar a escritorio

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


    // ===== POKÉMON SHINY =====

    var tarjetasPokemon = $(".leyendas [data-card]");
    
    // En tablet, móvil o dispositivos sin hover usamos toque
    function usarToquePokemon() {
        return window.matchMedia(
            "(max-width: 1024px), (hover: none)"
        ).matches;
    }


    // ORDENADOR: mostrar shiny al entrar en la tarjeta

    tarjetasPokemon.on("mouseenter", function () {

        if (!usarToquePokemon()) {
            $(this).addClass("mostrar-shiny");
        }

    });


    // ORDENADOR: volver al normal al salir

    tarjetasPokemon.on("mouseleave", function () {

        if (!usarToquePokemon()) {
            $(this).removeClass("mostrar-shiny");
        }

    });


    // TABLET Y MÓVIL: tocar el Pokémon para alternar

    tarjetasPokemon.find(".pokemon-imgs").on("click", function () {

        if (usarToquePokemon()) {
            $(this)
                .closest("[data-card]")
                .toggleClass("mostrar-shiny");
        }

    });


    // TECLADO: alternar con Enter o espacio
    // Las tarjetas ya tienen tabindex="0"

    tarjetasPokemon.on("keydown", function (evento) {

        // No interferir con botones dentro de la tarjeta
        if (evento.target !== this) {
            return;
        }

        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            $(this).toggleClass("mostrar-shiny");
        }

    });


    // Limpiar el estado al cambiar entre escritorio y móvil

    window.matchMedia(
        "(max-width: 1024px), (hover: none)"
    ).addEventListener("change", function () {

        tarjetasPokemon.removeClass("mostrar-shiny");

    });


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