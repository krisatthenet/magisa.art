import PocketBase from 'pocketbase';

const PB_URL = import.meta.env.VITE_PB_URL || (import.meta.env.PROD
	? 'https://db.magisa.art'
	: 'http://127.0.0.1:8090');

export const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

export default pb;
