// Family Points — la vuelta al mundo. Cada nivel es un país; cada 10 países se cambia de continente.
// Orden: Europa (empieza en España), América, África, Asia y Oceanía. En cada continente, los 10 países con más
// habitantes, de más a menos (en Europa, España primero y luego el resto de más a menos).
// No se incluyen países en guerra; su hueco lo ocupa el siguiente con más habitantes.
// Campos de la ficha: capital, monument (monumento o lugar más famoso), language (idioma oficial),
// demonym (gentilicio), y la bandera (por su código ISO).
// Saludo: hello (como se escribe), helloLang (idioma del saludo), say + voice (texto y voz para leerlo) y
// es (cómo leerlo con voz española si el dispositivo no tiene voz de ese idioma).
// icon + iconName: algo típico del país (emoji 3D), fact: dato curioso, colors: colores de la bandera.
(function (root) {
  'use strict';
  const C = (code, name, to, capital, monument, language, demonym, hello, helloLang, voice, es, say, icon, iconName, fact, colors) =>
    ({ code, name, to, capital, monument, language, demonym, hello, helloLang, voice, es, say: say || hello, icon, iconName, fact, colors });
  const CONTINENTS = [
    { id: 'europa', name: 'Europa', icon: '🌍', countries: [
      C('ES', 'España', 'a España', 'Madrid', 'Sagrada Familia (Barcelona)', 'español', 'español · española', '¡Hola!', 'español', 'es-ES', '¡Hola!', '', '⛪', 'Sagrada Familia',
        'La Sagrada Familia lleva más de 140 años en obras: se empezó en 1882.', ['#AA151B', '#F1BF00']),
      C('DE', 'Alemania', 'a Alemania', 'Berlín', 'Puerta de Brandeburgo (Berlín)', 'alemán', 'alemán · alemana', 'Hallo', 'alemán', 'de-DE', 'Jalo', '', '🥨', 'Pretzel',
        'En Alemania hay miles de castillos; uno de ellos inspiró el castillo de la Bella Durmiente.', ['#000000', '#DD0000', '#FFCE00']),
      C('GB', 'Reino Unido', 'al Reino Unido', 'Londres', 'Big Ben (Londres)', 'inglés', 'británico · británica', 'Hello', 'inglés', 'en-GB', 'Jelou', '', '💂', 'Guardia real',
        'Big Ben es el nombre de la gran campana; la torre del reloj se llama Torre Isabel.', ['#012169', '#C8102E']),
      C('FR', 'Francia', 'a Francia', 'París', 'Torre Eiffel (París)', 'francés', 'francés · francesa', 'Bonjour', 'francés', 'fr-FR', 'Bonyur', '', '🗼', 'Torre Eiffel',
        'La Torre Eiffel mide unos 330 metros y se construyó en 1889.', ['#0055A4', '#EF4135']),
      C('IT', 'Italia', 'a Italia', 'Roma', 'Coliseo (Roma)', 'italiano', 'italiano · italiana', 'Ciao', 'italiano', 'it-IT', 'Chao', '', '🏟️', 'Coliseo',
        'Dentro de Roma hay otro país: el Vaticano, el más pequeño del mundo.', ['#009246', '#CE2B37']),
      C('PL', 'Polonia', 'a Polonia', 'Varsovia', 'Castillo de Wawel (Cracovia)', 'polaco', 'polaco · polaca', 'Cześć', 'polaco', 'pl-PL', 'Chesch', '', '🏰', 'Castillo de Wawel',
        'Marie Curie, la primera persona que ganó dos premios Nobel, nació en Varsovia.', ['#FFFFFF', '#DC143C']),
      C('RO', 'Rumanía', 'a Rumanía', 'Bucarest', 'Castillo de Bran', 'rumano', 'rumano · rumana', 'Salut', 'rumano', 'ro-RO', 'Salut', '', '🧛', 'Drácula',
        'El Castillo de Bran es famoso porque se relaciona con la leyenda de Drácula.', ['#002B7F', '#FCD116', '#CE1126']),
      C('NL', 'Países Bajos', 'a los Países Bajos', 'Ámsterdam', 'Molinos de Kinderdijk', 'neerlandés', 'neerlandés · neerlandesa', 'Hallo', 'neerlandés', 'nl-NL', 'Jalo', '', '🌷', 'Tulipán',
        'Una cuarta parte del país está por debajo del nivel del mar.', ['#AE1C28', '#21468B']),
      C('BE', 'Bélgica', 'a Bélgica', 'Bruselas', 'Atomium (Bruselas)', 'neerlandés, francés y alemán', 'belga', 'Hallo · Bonjour', 'neerlandés y francés', 'nl-BE', 'Jalo. Bonyur', 'Hallo. Bonjour', '🧇', 'Gofre',
        'Allí nacieron los cómics de Tintín y de los Pitufos.', ['#000000', '#FDDA24', '#EF3340']),
      C('CZ', 'Chequia', 'a Chequia', 'Praga', 'Puente de Carlos (Praga)', 'checo', 'checo · checa', 'Ahoj', 'checo', 'cs-CZ', 'Ahoy', '', '🕰️', 'Reloj astronómico',
        'El reloj astronómico de Praga funciona desde hace más de 600 años.', ['#11457E', '#D7141A'])
    ] },
    { id: 'america', name: 'América', icon: '🌎', countries: [
      C('US', 'Estados Unidos', 'a Estados Unidos', 'Washington D. C.', 'Estatua de la Libertad (Nueva York)', 'inglés', 'estadounidense', 'Hello', 'inglés', 'en-US', 'Jelou', '', '🗽', 'Estatua de la Libertad',
        'Su bandera tiene 50 estrellas: una por cada estado.', ['#3C3B6E', '#B22234']),
      C('BR', 'Brasil', 'a Brasil', 'Brasilia', 'Cristo Redentor (Río de Janeiro)', 'portugués', 'brasileño · brasileña', 'Olá', 'portugués', 'pt-BR', 'Olá', '', '⚽', 'Fútbol',
        'Brasil ha ganado 5 Mundiales de fútbol, más que ningún otro país.', ['#009C3B', '#FFDF00', '#002776']),
      C('MX', 'México', 'a México', 'Ciudad de México', 'Chichén Itzá', 'español', 'mexicano · mexicana', '¡Hola!', 'español', 'es-MX', '¡Hola!', '', '🌮', 'Taco',
        'La palabra «chocolate» viene del náhuatl, la lengua de los aztecas.', ['#006847', '#CE1126']),
      C('CO', 'Colombia', 'a Colombia', 'Bogotá', 'Catedral de Sal de Zipaquirá', 'español', 'colombiano · colombiana', '¡Hola!', 'español', 'es-CO', '¡Hola!', '', '🦋', 'Mariposa',
        'Es el país con más especies de aves del mundo. Su Catedral de Sal está dentro de una mina.', ['#FCD116', '#003893', '#CE1126']),
      C('AR', 'Argentina', 'a Argentina', 'Buenos Aires', 'Obelisco (Buenos Aires)', 'español', 'argentino · argentina', '¡Hola, che!', 'español', 'es-AR', '¡Hola, che!', '', '🧉', 'Mate',
        'Allí está el Aconcagua, la montaña más alta de América.', ['#74ACDF', '#F6B40E']),
      C('CA', 'Canadá', 'a Canadá', 'Ottawa', 'Torre CN (Toronto)', 'inglés y francés', 'canadiense', 'Hello · Bonjour', 'inglés y francés', 'en-CA', 'Jelou. Bonyur', 'Hello. Bonjour', '🍁', 'Hoja de arce',
        'Canadá es el país con más lagos del mundo.', ['#D80621', '#FFFFFF']),
      C('PE', 'Perú', 'a Perú', 'Lima', 'Machu Picchu', 'español, quechua y aimara', 'peruano · peruana', 'Allillanchu', 'quechua', null, 'Alliyanchu', '', '🦙', 'Llama',
        'En Perú hay miles de variedades de patatas.', ['#D91023', '#FFFFFF']),
      C('CL', 'Chile', 'a Chile', 'Santiago', 'Moáis de la Isla de Pascua', 'español', 'chileno · chilena', '¡Hola!', 'español', 'es-CL', '¡Hola!', '', '🗿', 'Moái',
        'Chile mide más de 4.000 km de largo y es muy estrecho.', ['#D52B1E', '#0039A6']),
      C('GT', 'Guatemala', 'a Guatemala', 'Ciudad de Guatemala', 'Tikal', 'español', 'guatemalteco · guatemalteca', '¡Hola!', 'español', 'es-GT', '¡Hola!', '', '🌽', 'Maíz',
        'Su ave nacional, el quetzal, da nombre a su moneda.', ['#4997D0', '#FFFFFF']),
      C('EC', 'Ecuador', 'a Ecuador', 'Quito', 'Islas Galápagos', 'español', 'ecuatoriano · ecuatoriana', '¡Hola!', 'español', 'es-EC', '¡Hola!', '', '🐢', 'Tortuga gigante',
        'El país se llama así porque lo cruza la línea del ecuador.', ['#FFDD00', '#034EA2', '#ED1C24'])
    ] },
    { id: 'africa', name: 'África', icon: '🌍', countries: [
      C('NG', 'Nigeria', 'a Nigeria', 'Abuja', 'Roca Zuma', 'inglés', 'nigeriano · nigeriana', 'Hello', 'inglés', 'en-NG', 'Jelou', '', '🎬', 'Nollywood',
        'Es el país con más habitantes de África y su cine, Nollywood, es de los que más películas hace.', ['#008751', '#FFFFFF']),
      C('EG', 'Egipto', 'a Egipto', 'El Cairo', 'Pirámides de Guiza', 'árabe', 'egipcio · egipcia', 'Ahlan', 'árabe', 'ar-EG', 'Ajlan', 'أهلاً', '🐪', 'Camello',
        'La Gran Pirámide de Guiza tiene más de 4.500 años.', ['#CE1126', '#C09300', '#000000']),
      C('TZ', 'Tanzania', 'a Tanzania', 'Dodoma', 'Kilimanjaro', 'suajili e inglés', 'tanzano · tanzana', 'Jambo', 'suajili', null, 'Yambo', '', '🏔️', 'Kilimanjaro',
        'El Kilimanjaro es la montaña más alta de África: casi 5.900 metros.', ['#1EB53A', '#00A3DD', '#FCD116']),
      C('ZA', 'Sudáfrica', 'a Sudáfrica', 'Pretoria', 'Montaña de la Mesa (Ciudad del Cabo)', 'doce idiomas, como zulú, xhosa, afrikáans e inglés', 'sudafricano · sudafricana', 'Sawubona', 'zulú', null, 'Sauubona', '', '🐧', 'Pingüino africano',
        'Tiene tres capitales: Pretoria, Ciudad del Cabo y Bloemfontein.', ['#007749', '#FFB81C', '#E03C31', '#001489']),
      C('KE', 'Kenia', 'a Kenia', 'Nairobi', 'Reserva Masái Mara', 'suajili e inglés', 'keniano · keniana', 'Jambo', 'suajili', null, 'Yambo', '', '🦁', 'León',
        '«Safari» es una palabra suajili que significa «viaje».', ['#006600', '#BB0000', '#000000']),
      C('UG', 'Uganda', 'a Uganda', 'Kampala', 'Fuentes del Nilo (Jinja)', 'inglés y suajili', 'ugandés · ugandesa', 'Hello', 'inglés', 'en-GB', 'Jelou', '', '🐊', 'Cocodrilo del Nilo',
        'Del lago Victoria, en Uganda, sale el Nilo, uno de los ríos más largos del mundo.', ['#000000', '#FCDC04', '#D90000']),
      C('DZ', 'Argelia', 'a Argelia', 'Argel', 'Casba de Argel', 'árabe y tamazight (bereber)', 'argelino · argelina', 'Salam', 'árabe', 'ar-SA', 'Salam', 'سلام', '🏜️', 'Desierto del Sáhara',
        'Es el país más grande de África y la mayor parte es desierto del Sáhara.', ['#006233', '#D21034']),
      C('MA', 'Marruecos', 'a Marruecos', 'Rabat', 'Mezquita Hassan II (Casablanca)', 'árabe y tamazight (bereber)', 'marroquí', 'Salam', 'árabe', 'ar-SA', 'Salam', 'سلام', '🍵', 'Té con hierbabuena',
        'Solo unos 14 km de mar separan Marruecos de España.', ['#C1272D', '#006233']),
      C('AO', 'Angola', 'a Angola', 'Luanda', 'Cataratas de Kalandula', 'portugués', 'angoleño · angoleña', 'Olá', 'portugués', 'pt-PT', 'Olá', '', '🦒', 'Jirafa',
        'Las cataratas de Kalandula están entre las más grandes de África.', ['#CC092F', '#000000', '#FFCB00']),
      C('MZ', 'Mozambique', 'a Mozambique', 'Maputo', 'Isla de Mozambique', 'portugués', 'mozambiqueño · mozambiqueña', 'Olá', 'portugués', 'pt-PT', 'Olá', '', '🐬', 'Delfín',
        'Su costa en el océano Índico mide unos 2.500 km.', ['#009A44', '#000000', '#FCE100', '#D21034'])
    ] },
    { id: 'asia', name: 'Asia', icon: '🌏', countries: [
      C('IN', 'India', 'a la India', 'Nueva Delhi', 'Taj Mahal (Agra)', 'hindi e inglés', 'indio · india', 'Namasté', 'hindi', 'hi-IN', 'Namasté', 'नमस्ते', '🐘', 'Elefante',
        'Es el país con más habitantes del mundo. Allí se celebra Holi, la fiesta de los colores.', ['#FF9933', '#138808']),
      C('CN', 'China', 'a China', 'Pekín', 'Gran Muralla', 'chino mandarín', 'chino · china', 'Nǐ hǎo', 'chino', 'zh-CN', 'Ni jao', '你好', '🐼', 'Panda',
        'El panda gigante solo vive en libertad en las montañas de China.', ['#EE1C25', '#FFDE00']),
      C('ID', 'Indonesia', 'a Indonesia', 'Yakarta', 'Templo de Borobudur', 'indonesio', 'indonesio · indonesia', 'Halo', 'indonesio', 'id-ID', 'Jalo', '', '🦎', 'Dragón de Komodo',
        'Tiene más de 17.000 islas, y en algunas viven los dragones de Komodo.', ['#CE1126', '#FFFFFF']),
      C('PK', 'Pakistán', 'a Pakistán', 'Islamabad', 'Mezquita Badshahi (Lahore)', 'urdu e inglés', 'pakistaní', 'Assalam alaikum', 'urdu', null, 'Asalam aleikum', '', '🕌', 'Mezquita',
        'Allí está el K2, la segunda montaña más alta del mundo.', ['#01411C', '#FFFFFF']),
      C('BD', 'Bangladés', 'a Bangladés', 'Daca', 'Manglares de los Sundarbans', 'bengalí', 'bangladesí', 'Nomoshkar', 'bengalí', null, 'Nomoskar', '', '🐅', 'Tigre de Bengala',
        'En sus manglares, junto al mar, vive el tigre de Bengala.', ['#006A4E', '#F42A41']),
      C('JP', 'Japón', 'a Japón', 'Tokio', 'Monte Fuji', 'japonés', 'japonés · japonesa', 'Konnichiwa', 'japonés', 'ja-JP', 'Konichiua', 'こんにちは', '🗻', 'Monte Fuji',
        'Sus trenes bala superan los 300 km/h.', ['#BC002D', '#FFFFFF']),
      C('PH', 'Filipinas', 'a Filipinas', 'Manila', 'Colinas de Chocolate (Bohol)', 'filipino e inglés', 'filipino · filipina', 'Kumusta', 'filipino', null, 'Kumusta', '', '🍫', 'Colinas de Chocolate',
        'Las Colinas de Chocolate se vuelven marrones en la época seca, como bombones gigantes.', ['#0038A8', '#CE1126', '#FCD116']),
      C('VN', 'Vietnam', 'a Vietnam', 'Hanói', 'Bahía de Ha Long', 'vietnamita', 'vietnamita', 'Xin chào', 'vietnamita', 'vi-VN', 'Sin chao', '', '🍜', 'Pho',
        'La bahía de Ha Long tiene casi 2.000 islotes de piedra.', ['#DA251D', '#FFFF00']),
      C('TR', 'Turquía', 'a Turquía', 'Ankara', 'Santa Sofía (Estambul)', 'turco', 'turco · turca', 'Merhaba', 'turco', 'tr-TR', 'Merjaba', '', '🎈', 'Globos de Capadocia',
        'Su capital es Ankara, no Estambul, aunque Estambul es su ciudad más grande.', ['#E30A17', '#FFFFFF']),
      C('TH', 'Tailandia', 'a Tailandia', 'Bangkok', 'Gran Palacio (Bangkok)', 'tailandés', 'tailandés · tailandesa', 'Sawasdee', 'tailandés', 'th-TH', 'Sauasdi', 'สวัสดี', '🛺', 'Tuk-tuk',
        'Su nombre significa «tierra de los libres».', ['#A51931', '#F4F5F8', '#2D2A4A'])
    ] },
    { id: 'oceania', name: 'Oceanía', icon: '🌏', countries: [
      C('AU', 'Australia', 'a Australia', 'Canberra', 'Ópera de Sídney', 'inglés', 'australiano · australiana', "G'day", 'inglés', 'en-AU', 'Guedei', '', '🦘', 'Canguro',
        'Su capital es Canberra, no Sídney. Allí viven canguros y koalas.', ['#012169', '#E4002B']),
      C('PG', 'Papúa Nueva Guinea', 'a Papúa Nueva Guinea', 'Port Moresby', 'Casa del Parlamento (Port Moresby)', 'tok pisin, inglés e hiri motu', 'papú', 'Halo', 'tok pisin', null, 'Jalo', '', '🦜', 'Ave del paraíso',
        'Allí se hablan más de 800 idiomas, más que en ningún otro país.', ['#000000', '#CE1126', '#FCD116']),
      C('NZ', 'Nueva Zelanda', 'a Nueva Zelanda', 'Wellington', 'Fiordo de Milford Sound', 'inglés, maorí y lengua de signos', 'neozelandés · neozelandesa', 'Kia ora', 'maorí', null, 'Kia ora', '', '🥝', 'Kiwi',
        'El kiwi es un pájaro que no puede volar y es el símbolo del país.', ['#012169', '#C8102E']),
      C('FJ', 'Fiyi', 'a Fiyi', 'Suva', 'Arrecifes de la Costa de Coral', 'inglés, fiyiano e hindi fiyiano', 'fiyiano · fiyiana', 'Bula', 'fiyiano', null, 'Bula', '', '🏝️', 'Isla tropical',
        'Fiyi está formado por más de 300 islas.', ['#68BFE5', '#002868']),
      C('SB', 'Islas Salomón', 'a las Islas Salomón', 'Honiara', 'Laguna de Marovo', 'inglés', 'salomonense', 'Halo', 'pijin', null, 'Jalo', '', '🛶', 'Canoa',
        'Las Islas Salomón son cerca de 1.000 islas.', ['#0051BA', '#215B33', '#FCD116']),
      C('VU', 'Vanuatu', 'a Vanuatu', 'Port Vila', 'Volcán Yasur', 'bislama, inglés y francés', 'vanuatuense', 'Halo', 'bislama', null, 'Jalo', '', '🌋', 'Volcán Yasur',
        'Tiene una oficina de correos bajo el mar, donde se envían postales impermeables.', ['#D21034', '#009543', '#FDCE12']),
      C('WS', 'Samoa', 'a Samoa', 'Apia', 'Fosa de To Sua', 'samoano e inglés', 'samoano · samoana', 'Talofa', 'samoano', null, 'Talofa', '', '🌺', 'Flor tropical',
        'En 2011 Samoa se saltó un día entero del calendario para cambiar de horario.', ['#CE1126', '#002B7F']),
      C('KI', 'Kiribati', 'a Kiribati', 'Tarawa Sur', 'Isla de Navidad (Kiritimati)', 'inglés y kiribatiano', 'kiribatiano · kiribatiana', 'Mauri', 'kiribatiano', null, 'Mauri', '', '🌅', 'Primer amanecer',
        'Es de los primeros lugares del mundo en recibir el Año Nuevo.', ['#CE1126', '#003F87', '#FCD116']),
      C('FM', 'Micronesia', 'a Micronesia', 'Palikir', 'Ruinas de Nan Madol', 'inglés', 'micronesio · micronesia', 'Kaselehlie', 'pohnpeiano', null, 'Kaselelie', '', '🪨', 'Piedras de Nan Madol',
        'Nan Madol es una ciudad antigua construida sobre islotes de piedra en el mar.', ['#75B2DD', '#FFFFFF']),
      C('TO', 'Tonga', 'a Tonga', 'Nukualofa', 'Trilito Haʻamonga ʻa Maui', 'tongano e inglés', 'tongano · tongana', 'Mālō e lelei', 'tongano', null, 'Malo e lelei', '', '🐋', 'Ballena jorobada',
        'Es un reino: tiene rey y nunca fue colonia de otro país.', ['#C10000', '#FFFFFF'])
    ] }
  ];
  const COUNTRIES = [];
  CONTINENTS.forEach(ct => ct.countries.forEach(c => COUNTRIES.push(Object.assign({ continent: ct.id, continentName: ct.name }, c))));
  // Bandera como emoji (letras regionales)
  const flag = code => String.fromCodePoint(...[...code].map(ch => 0x1F1E6 + ch.charCodeAt(0) - 65));
  const api = { CONTINENTS, COUNTRIES, flag };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FP_WORLD = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
