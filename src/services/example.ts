import axios, { AxiosInstance } from 'axios';

function createApiInstance(): AxiosInstance {
	const api = axios.create({
		baseURL: 'http://localhost:3000',
	});

	api.defaults.headers.common['Authorization'] = `Bearer ...`;

	return api;
}

export const someApi = createApiInstance();
