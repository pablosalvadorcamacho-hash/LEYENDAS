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

    $(document).ready(function () {

        // 1. A los 3 segundos la Pokéball colapsa y explota
        setTimeout(function () {
            $(".loader-texto").fadeOut(200); // El texto desaparece al estallar
            $(".pokeball--loader").addClass("escapa");
        }, 3000);
    
        // 2. A los 3.5 segundos se disipa el fogonazo y aparece la web
        setTimeout(function () {
            $(".loader__track").fadeOut(400);
        }, 3500);

    });
    


    // ===== MODAL DE LEYENDAS =====

    // Cada grupo utiliza exactamente su nombre de data-card.
    // Cada Pokémon tiene sus propios datos.

    var gruposLeyendas = {

        Arceus: {
            color: "#f5c542",
            region: "Sinnoh",
            pokemon: [
                {
                    nombre: "Arceus",
                    tipos: ["Normal"],
                    debilidades: "Lucha",
                    eficacia: "Ninguno"
                }
            ]
        },

        PalkiaDialga: {
            color: "#b58aff",
            region: "Sinnoh",
            pokemon: [
                {
                    nombre: "Dialga",
                    tipos: ["Acero", "Dragón"],
                    debilidades: "Lucha · Tierra",
                    eficacia: "Hielo · Roca · Hada · Dragón"
                },
                {
                    nombre: "Palkia",
                    tipos: ["Agua", "Dragón"],
                    debilidades: "Dragón · Hada",
                    eficacia: "Fuego · Tierra · Roca · Dragón"
                }
            ]
        },

        MewMewto: {
            color: "#ff85b5",
            region: "Kanto",
            pokemon: [
                {
                    nombre: "Mew",
                    tipos: ["Psíquico"],
                    debilidades: "Bicho · Fantasma · Siniestro",
                    eficacia: "Lucha · Veneno"
                },
                {
                    nombre: "Mewtwo",
                    tipos: ["Psíquico"],
                    debilidades: "Bicho · Fantasma · Siniestro",
                    eficacia: "Lucha · Veneno"
                }
            ]
        },

        ReshiramZekrom: {
            color: "#ded6ba",
            region: "Teselia",
            pokemon: [
                {
                    nombre: "Reshiram",
                    tipos: ["Dragón", "Fuego"],
                    debilidades: "Tierra · Roca · Dragón",
                    eficacia: "Dragón · Planta · Hielo · Bicho · Acero"
                },
                {
                    nombre: "Zekrom",
                    tipos: ["Dragón", "Eléctrico"],
                    debilidades: "Tierra · Hielo · Dragón · Hada",
                    eficacia: "Dragón · Agua · Volador"
                }
            ]
        },

        RES: {
            color: "#e7bc62",
            region: "Johto",
            pokemon: [
                {
                    nombre: "Raikou",
                    tipos: ["Eléctrico"],
                    debilidades: "Tierra",
                    eficacia: "Agua · Volador"
                },
                {
                    nombre: "Entei",
                    tipos: ["Fuego"],
                    debilidades: "Agua · Tierra · Roca",
                    eficacia: "Planta · Hielo · Bicho · Acero"
                },
                {
                    nombre: "Suicune",
                    tipos: ["Agua"],
                    debilidades: "Eléctrico · Planta",
                    eficacia: "Fuego · Tierra · Roca"
                }
            ]
        },

        AZM: {
            color: "#7ddde1",
            region: "Kanto",
            pokemon: [
                {
                    nombre: "Articuno",
                    tipos: ["Hielo", "Volador"],
                    debilidades: "Fuego · Eléctrico · Roca · Acero",
                    eficacia: "Planta · Tierra · Volador · Dragón · Lucha · Bicho"
                },
                {
                    nombre: "Zapdos",
                    tipos: ["Eléctrico", "Volador"],
                    debilidades: "Hielo · Roca",
                    eficacia: "Agua · Volador · Planta · Lucha · Bicho"
                },
                {
                    nombre: "Moltres",
                    tipos: ["Fuego", "Volador"],
                    debilidades: "Agua · Eléctrico · Roca",
                    eficacia: "Planta · Hielo · Bicho · Acero · Lucha"
                }
            ]
        },

        Giratina: {
            color: "#e97979",
            region: "Sinnoh",
            pokemon: [
                {
                    nombre: "Giratina",
                    tipos: ["Fantasma", "Dragón"],
                    debilidades: "Hielo · Fantasma · Dragón · Siniestro · Hada",
                    eficacia: "Psíquico · Fantasma · Dragón"
                }
            ]
        },

        Rayquaza: {
            color: "#83d67a",
            region: "Hoenn",
            pokemon: [
                {
                    nombre: "Rayquaza",
                    tipos: ["Dragón", "Volador"],
                    debilidades: "Hielo · Roca · Dragón · Hada",
                    eficacia: "Dragón · Planta · Lucha · Bicho"
                }
            ]
        }

    };


    // Color de cada etiqueta de tipo

    var coloresTipos = {
        "Normal": "#d8d4dc",
        "Acero": "#b9c2ce",
        "Dragón": "#b38aff",
        "Agua": "#6ebcff",
        "Psíquico": "#ff87bd",
        "Fuego": "#ff7c62",
        "Eléctrico": "#f4d85d",
        "Hielo": "#8de6e6",
        "Volador": "#a8b9ef",
        "Fantasma": "#9b82c7"
    };

    var iconosTipos = {
        "Normal": "media/elements/normal.svg",
        "Acero": "media/elements/steel.svg",
        "Dragón": "media/elements/dragon.svg",
        "Agua": "media/elements/water.svg",
        "Psíquico": "media/elements/psychic.svg",
        "Fuego": "media/elements/fire.svg",
        "Eléctrico": "media/elements/electric.svg",
        "Hielo": "media/elements/ice.svg",
        "Volador": "media/elements/flying.svg",
        "Fantasma": "media/elements/ghost.svg",
        "Siniestro": "media/elements/dark.svg"
    };


    var ventanaLeyenda = $(".modal-leyenda")[0];
    var grupoActual;
    var tarjetaActual;
    var posicionPokemon = 0;
    var botonDetalles;


    // Rellenar la ventana con el Pokémon seleccionado

    function mostrarPokemon() {

        var pokemon = grupoActual.pokemon[posicionPokemon];

        // Seleccionamos la imagen normal de la tarjeta original
        var imagen = tarjetaActual
            .find(".pokemon-imgs")
            .eq(posicionPokemon)
            .find("img:not(.shiny)");

        $(".modal-imagen").attr({
            src: imagen.attr("src"),
            alt: pokemon.nombre
        });

        $("#modal-nombre").text(pokemon.nombre);
        $(".modal-region").text(grupoActual.region);
        $(".modal-debilidades").text(pokemon.debilidades);
        $(".modal-eficacia").text(pokemon.eficacia);

        $(".modal-contador").text(
            (posicionPokemon + 1) + " / " + grupoActual.pokemon.length
        );

        // No hacen falta flechas en las tarjetas individuales
        $(".modal-navegacion").prop(
            "hidden",
            grupoActual.pokemon.length === 1
        );

        // Creamos las etiquetas de los tipos
        $(".modal-tipos").empty();

        $.each(pokemon.tipos, function (indice, tipo) {

            var etiqueta = $("<span>")
                .addClass("modal-tipo")
                .css("color", coloresTipos[tipo]);
            
            $("<span>")
            .addClass("modal-tipo-icono")
            .attr("aria-hidden", "true")
            .css({
                "-webkit-mask-image": 'url("' + iconosTipos[tipo] + '")',
                "mask-image": 'url("' + iconosTipos[tipo] + '")'
            })
            .appendTo(etiqueta);
            
            $("<span>")
                .text(tipo)
                .appendTo(etiqueta);
            
            etiqueta.appendTo(".modal-tipos");

        });

    }


    // Abrir al pulsar Ver detalles

    $(".detalles-button").on("click", function () {

        botonDetalles = this;
        tarjetaActual = $(this).closest("[data-card]");

        var nombreGrupo = tarjetaActual.attr("data-card");
        grupoActual = gruposLeyendas[nombreGrupo];

        if (!grupoActual) {
            return;
        }

        posicionPokemon = 0;

        var articulo = tarjetaActual.closest(".lista-leyendas-card");

        // Reutilizamos el texto que ya hay junto a la tarjeta
        $(".modal-etiqueta").text(
            articulo.find("[class$='-pretitulo']").text().trim()
        );

        $(".modal-descripcion").text(
            articulo.find("[class$='-descripcion']").text().trim()
        );

        $(".modal-leyenda").css("--modal-color", grupoActual.color);

        mostrarPokemon();

        $("body").addClass("modal-abierto");
        ventanaLeyenda.showModal();
        ventanaLeyenda.scrollTop = 0;

    });


    // Pasar al siguiente Pokémon del grupo

    $(".modal-siguiente").on("click", function () {

        posicionPokemon++;

        if (posicionPokemon >= grupoActual.pokemon.length) {
            posicionPokemon = 0;
        }

        mostrarPokemon();

    });


    // Volver al Pokémon anterior del grupo

    $(".modal-anterior").on("click", function () {

        posicionPokemon--;

        if (posicionPokemon < 0) {
            posicionPokemon = grupoActual.pokemon.length - 1;
        }

        mostrarPokemon();

    });


    // Cerrar con el botón

    $(".modal-cerrar").on("click", function () {
        ventanaLeyenda.close();
    });


    // Cerrar al pulsar en el fondo, fuera de la ventana

    $(".modal-leyenda").on("click", function (evento) {

        if (evento.target !== ventanaLeyenda) {
            return;
        }

        var limites = ventanaLeyenda.getBoundingClientRect();

        if (
            evento.clientX < limites.left ||
            evento.clientX > limites.right ||
            evento.clientY < limites.top ||
            evento.clientY > limites.bottom
        ) {
            ventanaLeyenda.close();
        }

    });


    // Se ejecuta también cuando se cierra con Escape

    $(ventanaLeyenda).on("close", function () {

        $("body").removeClass("modal-abierto");

        if (botonDetalles) {
            botonDetalles.focus();
        }

    });
});