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
            $(".menu-boton").focus();
        }

    });


    // Restablecer el menú al pasar a Desktop

    $(window).on("resize", function () {

        if ($(window).width() > 700) {
            cerrarMenu();
        }

    });


    // ANIMACIONES AL HACER SCROLL

    AOS.init({
        duration: 650,
        once: false,
        offset: 80
    });


    // ===== CARRUSEL DE CARTAS =====

    var cartaActual = 0;
    var totalCartas = $(".cartas-slide").length;

    $(".cartas-total").text(totalCartas);

    function mostrarCarta() {

        // Cada desplazamiento equivale al ancho de una diapositiva
        var desplazamiento = cartaActual * 100;

        $(".cartas-pista").css(
            "transform",
            "translateX(-" + desplazamiento + "%)"
        );

        $(".cartas-actual").text(cartaActual + 1);

        // Solo la carta visible queda disponible para lectores de pantalla
        $(".cartas-slide").attr("aria-hidden", "true");

        $(".cartas-slide").eq(cartaActual).attr("aria-hidden", "false");

    }

    $(".cartas-siguiente").on("click", function () {

        cartaActual = cartaActual + 1;

        if (cartaActual >= totalCartas) {
            cartaActual = 0;
        }

        mostrarCarta();

    });

    $(".cartas-anterior").on("click", function () {

        cartaActual = cartaActual - 1;

        if (cartaActual < 0) {
            cartaActual = totalCartas - 1;
        }

        mostrarCarta();

    });


    // ===== VERSIÓN SHINY =====

    $(".cartas-version").on("click", function () {

        $(".cartas-carrusel").toggleClass("cartas-modo-shiny");

        if ($(".cartas-carrusel").hasClass("cartas-modo-shiny")) {

            $(this).text("Ver versión normal");
            $(this).attr("aria-pressed", "true");

            $(".carta-normal").attr("aria-hidden", "true");
            $(".carta-shiny").attr("aria-hidden", "false");

        } else {

            $(this).text("Ver versión shiny");
            $(this).attr("aria-pressed", "false");

            $(".carta-normal").attr("aria-hidden", "false");
            $(".carta-shiny").attr("aria-hidden", "true");

        }

    });

});