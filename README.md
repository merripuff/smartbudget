# SmartBudget – Menedżer Finansów (projekt web)

SmartBudget to responsywna aplikacja webowa do zarządzania budżetem domowym. Umożliwia rejestrację i logowanie użytkownika (JWT), dodawanie i zarządzanie transakcjami (CRUD), filtrowanie danych, wyświetlanie podsumowań (KPI) oraz analizę wydatków na wykresie. Dodatkowo aplikacja integruje się z zewnętrznym API kursów walut (NBP).

---

## Najważniejsze funkcje
- ✅ Rejestracja i logowanie użytkowników (JWT + bcrypt)
- ✅ Autoryzacja żądań do API (Bearer token)
- ✅ CRUD transakcji:
  - dodawanie / listowanie / edycja / usuwanie
- ✅ Filtry transakcji: typ, kategoria, zakres dat
- ✅ Podsumowanie: przychody, wydatki, saldo
- ✅ Wykres wydatków wg kategorii (Chart.js)
- ✅ Integracja z zewnętrznym API: kursy walut (NBP) – EUR/USD/GBP
- ✅ Responsywny UI (CSS Grid/Flex + media queries), animacje i interakcje

---

## Technologie
**Frontend:**
- HTML5 (semantyka: header/nav/main/section/article/footer)
- CSS3 (Flexbox/Grid, media queries)
- JavaScript (DOM, fetch, eventy)

**Backend:**
- Node.js
- Express
- MongoDB Atlas + Mongoose
- JWT (jsonwebtoken)
- bcrypt

**Dodatki:**
- Chart.js (wykres)
- API NBP (kursy walut)

---

## Struktura projektu
smartbudget/
client/ # frontend (wielostronicowy)
index.html
login.html
register.html
dashboard.html
css/
js/
server/ # backend (Express + MongoDB)
src/
server.js
models/
routes/
middleware/
package.json
.env (lokalnie, NIE commitujemy)
.gitignore
README.md


## Uruchomienie lokalne

### Wymagania
- Node.js (LTS)
- Git
- Konto MongoDB Atlas (darmowy klaster)

---

### 1) Backend (API)
1. server/
   ```bash
   cd server
2. Zainstaluj zależności:
npm install

3. Uruchom serwer:

npm run dev



Test działania:
http://localhost:3000/api/health

   2) Frontend (UI)

Otwórz folder projektu w VS Code.

Uruchom rozszerzenie Live Server na pliku:

client/index.html