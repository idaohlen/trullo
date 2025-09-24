# Trullo

## Teknikstack
- [Vite](https://vite.dev)
- [Express](https://expressjs.com)
- [MongoDB](https://www.mongodb.com/docs/manual/)
- [Mongoose](https://mongoosejs.com)
- [Apollo GraphQL](https://www.apollographql.com)
- [Vue](https://vuejs.org)
- [Vue Apollo](https://apollo.vuejs.org)

## Kom igång
Servern kräver en `.env`-fil för att kunna köras korrekt med referens till en **MongoDB-databas** och en **JWT-secret** för user authentication.

```
MONGO_URI=mongodb://localhost:27017/trullo
JWT_SECRET="a very secret password"
```

Kom ihåg att köra `npm install` för att installera alla paket som krävs av projektet.

Utvecklingsservern är konfigurerad genom Vite att använda ett plugin för Express så att man kan köra både frontend och backend på samma gång på `http://localhost:4000/` (default) med följande kommando:

```zsh
npm run dev
```

(Porten kan ändras via `.env`-filen om så önskas under fältet `VITE_PORT`. I projektet finns en `.env.example` fil som exempel.)

Du kan också välja att köra bara backendservern med följande kommando, och servern körs per default då på `http://localhost:3000/` om du inte lagt till ett eget värde för `PORT`:

```zsh
npm run dev:server
```

### Seed

Med en `.env`-fil på plats med länk till en MongoDB-databas kan du använda seed-kommandot i terminalen för att fylla databasen med dummy data:

```zsh
npm run seed
```

**OBS! Databasen kommer rensas från existerande innehåll.**

Här är testanvändare för en user och en admin från seeden du kan använda för att testa att logga in:

```
# USER
email: user@trello.com
password: Password1!

# ADMIN
email: admin@trello.com
password: Password1!
```

I `/server/scripts/seed-data/users.js` hittar du ännu fler dummy-users om du hellre vill logga in med dem istället. Eller så registrerar du en helt ny användare genom REST- eller GraphQL-API:et, alternativt direkt i frontend. Nya användare får automatiskt rollen `user` och har begränsad åtkomst i API:erna och i frontend, så roll behöver ändras manuellt i databasen eller genom en admin-användare.
