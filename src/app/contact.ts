// Rajapintaluokka jossa määritellään kontaktin ominaisuudet ja niiden tietotyypit
export interface Contact {
        id: string | number;  // Firestore käyttää string-muotoisia id:itä
        name: string;
        email: string;
}
