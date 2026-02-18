import { Client, Account, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1') // Endpoint Singapura
    .setProject('perisaireputasi'); // Project ID Anda

export const account = new Account(client);
export const databases = new Databases(client);
export { client };