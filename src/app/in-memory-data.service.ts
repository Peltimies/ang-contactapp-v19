import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Contact } from './contact';

export class InMemoryDataService implements InMemoryDbService {
    createDb() { // createDb() on InMemoryDbService -rajapinnan metodi joka palauttaa datan
        const contacts: Contact[] = [
            {
                id: 1,
                name: 'Elmeri Rummukainen',
                email: 'elmeri@maili.com'
            },
            {
                id: 2,
                name: 'Ana Rummukainen',
                email: 'ana@somewhere.com'
            },
            {
                id: 3,
                name: 'Vilippus Rummukainen',
                email: 'vili@somewhere.com'
            },
            {
                id: 4,
                name: 'Jappo Husso',
                email: 'jappo@somewhere.com'
            },
        ];

        return {contacts};
    }
     /*
    genId -metodi generoi uudelle valetietokantaan tulevalle tietueelle
    automaattisesti id-arvon, kuten oikea tietokantakin tekee. Jos
    regs-taulukko on tyhjä, generoidaan 1, muuten viimeisin id + 1.
    */
  genId(contacts: Contact[]): number {
    return contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
  }
}
