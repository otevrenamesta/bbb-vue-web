# bbb - basic building block web

Zakladni myslenky udrzitelneho systemu pro spravu webu:
- maximalni oddeleni:
  - visualni styl (__S__) (CSS)
  - template (__T__) = jaky HTML kod se bude generovat
  - data (__D__) = struktura komponent tvoricich jednotlive stranky a jejich texty
- data v textovych souborech (daji se eventualne verzovat, [napr. web OM](https://github.com/otevrenamesta/web)).
- web jako JS aplikace konzumujici data z ruznych zdroju
- moznost generovat static web pro uzivatele s vypnutyn JS (resi se headless browserem)

## Web data - slozka statickych textovych souboru

- data (__D__) - jednotlive stranky jsou ve forme yaml souboru - nejuspornejsi 
a nejjednossi zpusob, jak definovat hierarchickou strukturu.
Kazdy yaml soubore = 1 stranka. Jeho path na webu odpovida path ve strome slozky.
Kazdy ma:
  - zakladni meta-atributy (title, desc, ...)
  - layout: [jaky layout](https://github.com/otevrenamesta/web/tree/master/_service/layouts) se pro stranku pouzije
  - children = pole komponent, ze kterych se sklada (ty se mohou opet skladat pomoci buildin componentu [composition](components/composition.js) jako [napr. zde](https://github.com/otevrenamesta/web/blob/master/index.yaml#L6)).
- templates (__T__) + style (__S__): v extra podslozce **_service**:
  - [layouts](https://github.com/otevrenamesta/web/tree/master/_service/layouts): [vue.js](https://vuejs.org/) template jak se vyrenderuje stranka
  - [components](https://github.com/otevrenamesta/web/tree/master/_service/components): vue.js komponenty, ktere obsahuji jak template, tak mohou obsahovat slozitejsi logiku (nacitani dat, filtrace, ...).
  Specialni component [composition](components/composition.js) je pro komplexnejsi kompozice.
  Atribut class muze obsahovat znaky ">" ktere zpusobi vyrenderovani zanorenych div elementu.
  Tedy napr. [container>columns](https://github.com/otevrenamesta/web/blob/master/index.yaml#L7) vyrenderuje:
  ```
  <div class="container">
    <div class="columns">
      children ... 
    </div>
  </div>
  ```
  - [style](https://github.com/otevrenamesta/web/tree/master/_service/style): sass based custom style (momentalne bootstrap a [bulma.io](https://bulma.io/)).
  Main soubor je [custom.scss](_service/style/custom.scss) ktery importuje vse potrebne
  pro cely styl webu.

__V repositari nejsou zadne assety.__
Ty jsou v udrzitelnem reseni hostovany mimo (CDN) a web na ne pouze odkazuje.

## Backend

[Backendova cast](https://github.com/otevrenamesta/bbb-cms-api) umoznuje:
- pomoci API editovat __D__.
- pomoci webDAV protokolu editovat celou **_service** slozku - pristup pro webare, spravce, ...
- renderovat seznam routes webu ze stromu souboru YAML.