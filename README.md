# Słówkowo

Gra PWA do nauki angielskich słówek dla dzieci (interfejs po polsku). Czysty HTML + CSS + JS, bez bundlera.

## Uruchomienie

```sh
python3 -m http.server 8000
# http://localhost:8000
```

Service worker działa tylko przez `http://localhost` albo HTTPS.

## Pliki

- `app.js` – bank słówek (`WORDS`), poziomy (`LEVELS`), tryby, nagrody, odznaki, zwierzaki
- `db.js` – gracze w IndexedDB
- `sw.js` – offline (najpierw sieć, potem cache). **Podbij `CACHE` przy każdej zmianie plików.**
- `gifs/` – zwierzaki-awatary (te same co w Odejmowanku)
