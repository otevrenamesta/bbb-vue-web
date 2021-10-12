# bbb - basic building block web

### Manažerské shrnutí

bbb je web řešení na bázi [jamstack](https://jamstack.org/).
Přoč je tento směr budoucností a jaké přináší výhody oproti tradičním [se píše např. zde](https://www.rascasone.com/cs/blog/co-je-jamstack-vs-wordpress-cms).
Základní myšlenky udržitelného systému pro správu webu:
- maximální oddělení:
  - visualní styl (__S__) (CSS)
  - template (__T__) = jaký HTML kód se bude generovat
  - data (__D__) = struktura komponent tvořících jednotlivé stránky a jejich texty
- data v textových souborech, aby se dali verzovat a rychle servírovat přes CDN.
- web jako JS aplikace konzumujici data z ruznych zdroju
- možnost generovat statický web pro uživatele s vypnutým JS nebo crawlery

> web jako lepidlo open dat z ruznych zdroju, ktere ty data hezky vyrenderuje.

Znamená to, že moderní web se aktualizuje sám díky tomu, že prostě pouze vykresluje otevřená data, která v jiných systémech už beztak vznikají.

## Web data - slozka statickych textovych souboru

 [Pro příklad web OM](https://github.com/otevrenamesta/web)

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

## [Backend](https://github.com/otevrenamesta/bbb-cms-api)

Backend je volitelna soucast, Web ho nutne nepotrebuje.
Je potreba jako nastroj pro editaci, nebo pro automaticke pregenerovavani generovanych soucasti (napr. stylu).
Vice v repozitari.

## Development

Run dev mode:
```
DATA_FOLDER=/path/to/your/bbb-web npm start
```
