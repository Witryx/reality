# Jak přidat nové byty do `public/data/properties.json`

1) Otevři `public/data/properties.json`.
2) Do pole `properties` přidej nový objekt podle šablony níže (oddělený čárkou).
3) `id` musí být unikátní číslo.
4) `images` jsou cesty do `public/uploads/…` (stačí relativní `/uploads/...`).
5) `language` je volitelná – nech prázdné/nezadávej pro všechny jazyky, nebo použij `cz`/`en`/`de`/`all`.

### Šablona jednoho bytu (zkopíruj a doplň)
```json
{
  "id": 4,
  "name": "Projekt / lokalita",
  "location": "Hurghada / El Gouna / …",
  "price": "from 150 000 EUR",
  "sqm": "85",
  "rooms": "3+kk",
  "tag": "Hot", 
  "description": "Krátký popis bytu/projektu.",
  "longDescription": "Delší popis (volitelný). Můžeš použít \\n pro odstavce nebo ponechat jeden dlouhý text.",
  "images": [
    "/uploads/tvoje-foto-1.jpg",
    "/uploads/tvoje-foto-2.jpg"
  ],
  "language": "all"
}
```
