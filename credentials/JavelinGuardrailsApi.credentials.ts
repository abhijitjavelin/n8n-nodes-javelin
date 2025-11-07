import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class JavelinGuardrailsApi implements ICredentialType {
	name = 'javelinGuardrailsApi';

	displayName = 'Javelin Guardrails API';

	icon: Icon = 'file:javelin.svg';

	documentationUrl = 'https://docs.getjavelin.io/';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api-dev.javelin.live',
			required: true,
			description: 'The base URL for the Javelin API (e.g., https://api-dev.javelin.live)',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Javelin Guardrails API key',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-javelin-apikey': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v1/system/healthz',
			method: 'GET',
		},
	};
}