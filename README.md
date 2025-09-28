# Trullo

Trullo är ett enkelt projekthanteringsverktyg som låter användare planera, organisera och samarbeta kring projekt och uppgifter.

Detta är i huvudsak ett RESTful API-projekt byggt för MongoDB med Express och Mongoose, men har också en GraphQL-API som speglar innehållet i REST-API:et. Frontend är byggt med Vue.js och använder sig av GraphQL och Apollo server/client för att hämta och visa data från databasen.

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

Du kan också välja att köra bara backendservern med följande kommando (servern körs per default då på `http://localhost:3000/` om du inte lagt till ett eget värde för `PORT`):

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
email: user@trullo.com
password: Password1!

# ADMIN
email: admin@trullo.com
password: Password1!
```

I `/server/scripts/seed-data/project.js` hittar du ännu fler dummy-users om du hellre vill logga in med dem istället. Eller så registrerar du en helt ny användare genom REST- eller GraphQL-API:et, alternativt direkt i frontend. Nya användare får automatiskt rollen `user` och har begränsad åtkomst i API:erna och i frontend, så roll behöver ändras manuellt i databasen eller genom en admin-användare.


## Teoretiska resonemang

### Val av databas
Jag valde att använda MongoDB främst för att få mer erfarenhet av att använda just MongoDB och Mongoose i ett Express-API, men av den erfarenheten jag har så är en NoSQL-baserad databas som MongoDB väldigt behaglig att jobba med för att snabbt komma igång med att bygga och iterera på projekt. Eftersom det inte krävs databasmigreringar på samma sätt som SQL-baserade databaser är det smidigt att lägga till och ta bort fält i sina collections.

MongoDB kan passa bra till många olika typer av applikationer, men kanske inte till projekt som kräver den robustheten och strikta strukturen man får med SQL. Har man många olika system och applikationer som ska kopplas kan det vara mer fördelaktigt att jobba med den mer förutsägbara strukturen som finns med SQL-tabeller.

För ett mindre och isolerat projekt som Trullo passar MongoDB väldigt bra.

### Tekniker i applikationen

#### API
- **Express.js**: Bidrar med ett extra lager ovanpå Node.js för att förenkla byggandet av API:er.
- **Mongoose**: Ett ODM som gör det enkelt att arbeta med MongoDB i sin Express-applikation.
- **Zod**: Används för att validera data som matas in och ser till rätt fält blir ifyllda med rätt struktur.
- **GraphQL & Apollo Server**: Används för att bygga en GraphQL-baserad API till Trullo som används till frontend.
- **Swagger**: Används för att sätta upp en visuell dokumentation av REST API:et.


#### Autentisering
- **jsonwebtoken**: Skapar och verifierar JWT-tokens för att hantera autentisering och sessionshantering.
- **cookie-parser**: Läser och tolkar cookies från inkommande HTTP-förfrågningar, används för att hantera autentiseringstokens i cookies.
- **bcrypt.js**: Hashar och saltar lösenord innan de sparas i databasen, vilket ökar säkerheten mot intrång.

Samt **Vue.js**, **TailwindCSS** och **shadcn** för frontend och en del andra paket som underlättar viss funktionalitet.


### Redogör översiktligt hur applikationen fungerar
I min version av "Trullo" kan man hantera projekt och tillhörande att-göra-uppgifter. För att använda appen krävs att man registrerar sig som en användare, och när man är inloggad får man tillgång till att gå med i existerande projekt eller att skapa nya.

Tasks är låsta till sina projekt, så man måste vara en deltagare i ett projekt för att lägga till uppgifter eller ändra på dem.

Administratörkonton har tillåtelse att ta bort och ändra i alla appens olika resurser: användare, projekt och uppgifter.

## Reflektioner
Även om detta var en uppgift som gick ut på att bygga en REST-API ville jag ändå utforska GraphQL lite mer för att få en bättre uppfattning av skillnaderna med att jobba med de två olika API-strukturerna. Då jag har stort intresse för frontend så valde jag också att bygga en frontend för projektet. Detta innebar mer arbete, men underlättande mycket i designen av API:et då det blev lättare att visualisera vilken data och rutter som skulle behövas för att bygga en bra användarupplevelse, någon som lätt kan bli svårt när man bygger ett API helt isolerat med bara terminal och Postman att testa med.

Jag jobbade i första hand med att bygga upp GraphQL API:et tillsammans med frontend, och när jag var nöjd med det arbetet portade jag över funktionaliteten till REST-API:et. Även om mycket av själva logiken i koden kan vara ganska lik och skiljer sig mest i hur man använder felhantering och middleware, så var det lite bökigt att översätta från det ena till det andra, och ibland behövde jag använda helt andra lösningar för det ena API:et som inte kunde struktureras exakt likadant i det andra. Middleware var mycket enklare att jobba med i REST-API:et, och jag lade mycket tid på att försöka hitta sätt att göra saker så smidigt som möjligt, t.ex. implementera schema directives i GraphQL-API:et för att kunna sätta olika krav på autentisering och användarroller direkt i GraphQL typedefs.

Jag tycker om att banta ner på kod där det är möjligt, och refaktoriserar gärna upprepande logik till utility functions som både minskar antalet rader kod och gör det mer läsbart. Jag har försökt göra det med bland annat felhantering och paginering.


## Fördjupning och förbättring
- **Förminska overfetching i REST-API:et.** Filtrera striktare i den data som skickas tillbaka beroende på vart det används och vem som kommer se det. I ett flertal routes skickas det tillbaka alldeles för mycket irrelevant data (som `/projects/:projectId/tasks` där hela projektet inkluderas med varje task). I GraphQL fanns det mycket mer flexibilitet för detta, och är den största styrkan med GraphQL.
- **Refresh tokens.** Vid utloggning rensas bara cookien som förvarar autentiseringstoken, men har man sparat ner den går den att återanvända så länge dess livstid är aktiv. Ett alternativ på bättre practice kan vara att ge token:et kortare livstid och använda refresh tokens som byter ut den aktiva token:et med jämna mellanrum.
- **Mer felsökning och buggfix.** Ju fler modeller i databasen desto komplexare är det att se till att all funktionalitet fungerar som det ska. Jag har gjort den mesta av felsökningen via frontend då det ger en bra överblick över ytlig logik, men även om något fungerar som det ska i frontend kan det finnas säkerhetsbrister i backend om man låst rutter på ett inkorrekt sätt etc. som går att utnyttja om man använder API:et direkt istället för genom frontend.
- **Testa att deploya projektet.** Jag har delvis satt upp för att projektet ska kunna deployas men genomföljde aldrig detta, så det kan krävas viss justering i hur projektet är uppbyggt.
