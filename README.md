# Dfunkt - Ny funktionärslista för Konglig Datasktionen

Dfunkt håller koll på roller, mandat och personer. Roller har sina beskrivningar och emailaddresser, mandat har en sträckningstid, en person, och en roll, och personer är personer.

Dfunkt är ännu i ett tidigt stadium, men just nu listar den datan den har och man kan lägga till de olika sakerna.

## Usage (rest api)

Endpoint: https://dfunkt.datasektionen.se

* `GET /api/roles` - Listar alla roller
* `GET api/role/:identifier` - Listar en specifik roll och alla mandat någonsin på denna roll.
* `GET api/role/id/:id` - Listar en specifik roll (efter roll-id) och alla mandat någonsin på denna roll.
* `GET api/role/:identifier/current` - Listar en specifik roll och dess nuvarande mandat.
* `GET api/role/id/:id/current` - Listar en specifik roll och dess nuvarande mandat.
* `GET api/roles/type/:groupIdentifier/all` - Listar alla roller (efter grupp-id) och alla mandat någonsin på dessa roller.
* `GET api/roles/type/:groupIdentifier/all/current` - Listar alla roller (efter grupp-id) och nuvarande mandat på dessa roller.
* `GET api/roles/all` - Listar alla roller och alla mandat någonsin på dessa roller.
* `GET api/roles/all/current` - Listar alla roller och alla nuvarande mandat på dessa roller.
* `GET api/users` - Listar alla användare någonsin (i dfunk-systemet).
* `GET api/users/kthid/:kthid` - Listar en specifik användare.
* `GET api/users/kthid/:kthid/current` - Listar en specifik användare och dess nuvarande mandat.
* `GET api/users/kthid/:ugkthid` - Listar en specifik användare.
* `GET api/users/kthid/:ugkthid/current` - Listar en specifik användare och dess nuvarande mandat.

## Roadmap, I guess

 * Oh right, byta till Postregsql, right? Tror den kör SQLite3 i bakgrunden nu.

## Installation

    npm install
    npm start

Och sen kan du öppna `localhost:5000` i webbläsarn.
