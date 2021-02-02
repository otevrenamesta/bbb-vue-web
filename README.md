# BBB - basic building block web

Zakladni myslenky udrzitelneho systemu pro spravu webu:
- maximalni oddeleni:
  - visualni styl (CSS) - standard
  - template = jaky HTML kod se bude generovat
  - data (__D__) = struktura komponent tvoricich jednotlive stranky a texty
- data v textovych souborech (daji se eventualne verzovat).
- web jako JS aplikace konzumujici data z ruznych zdroju
- moznost generovat static web

## Struktura repositare s webem

- data (__D__): jsou ve forme javascript souboru, ktere se primo requiruji vue komponentami.
- template: js soubory, ktere rikaji, jaky HTML se z __D__ vygeneruje.
- components: komponenty pro poskladani webu dohromady

__V repositari nejsou zadne assety.__
Ty jsou v udrzitelnem reseni hostovany mimo (CDN) a web na ne pouze odkazuje.
