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