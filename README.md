# IND Productie Portaal

Eenvoudige productieregistratie voor medewerkers met een afgeschermd admin-dashboard voor analyse, normberekening en sturing.

## MVP scope

- Eén publieke registratiepagina voor medewerkers
- Medewerkerherkenning via naam + 4-cijfercode (lokaal onthouden in browser)
- Admin login en dashboard
- Gecorrigeerde normberekening
- Medewerkersbeheer, normprofielen, werkzaamheidscategorieën
- Registratiegraad (completeness)

## Starten

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open daarna:

- Medewerkerregistratie: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

## Demo accounts

### Admin
- E-mail: `admin@ind.nl`
- Wachtwoord: `admin123`

### Medewerkers (4-cijfercode)
- Jan Jansen → `1234`
- Petra Smit → `2345`
- Lisa de Boer → `3456`
- Marko Landman → `4567`

## Belangrijke ontwerpkeuzes

- Medewerkers zien **geen normen, percentages of trends**
- Ingeplande uren staan centraal in admin, niet in het dagformulier
- Andere werkzaamheden via vaste categorieën i.p.v. vrije tekst
- Medewerkers worden gedeactiveerd i.p.v. verwijderd voor historische rapportage
- Normhistorie wordt bewaard in het datamodel

## Privacy

Dit systeem valt in de sfeer van personeelsmonitoring. Gebruik binnen IND pas na afstemming met Privacy/FG, Security en medezeggenschap. Sla geen dossierinhoud of zaakdetails op — alleen aantallen en tijdcategorieën.

## Tech stack

- Next.js 15
- Prisma + SQLite
- Tailwind CSS

## GitHub

Remote:

```bash
git remote add origin https://github.com/Feridebagisjova/IND.git
git push -u origin main
```
