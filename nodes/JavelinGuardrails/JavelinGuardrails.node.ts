import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { NodeConnectionTypes } from 'n8n-workflow';

export class JavelinGuardrails implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Javelin Guardrails',
		name: 'javelinGuardrails',
		icon: 'fa:shield-alt',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Sanitize and validate content using Javelin Guardrails API',
		defaults: {
			name: 'Javelin Guardrails',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'javelinGuardrailsApi',
				required: true,
			},
		],
		requestDefaults: {
			headers: {
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Apply Guardrails',
						value: 'apply',
						description: 'Sanitize input text using Javelin Guardrails',
						action: 'Apply guardrails to text',
					},
				],
				default: 'apply',
			},
			{
				displayName: 'Input Text',
				name: 'inputText',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'Enter text to sanitize',
				description: 'The text content to be processed by Javelin Guardrails',
				displayOptions: {
					show: {
						operation: ['apply'],
					},
				},
			},
			{
				displayName: 'Request Source',
				name: 'requestSource',
				type: 'string',
				default: 'n8n',
				description: 'Source identifier for tracking purposes',
				displayOptions: {
					show: {
						operation: ['apply'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		if (operation === 'apply') {
			for (let i = 0; i < items.length; i++) {
				try {
					const inputText = this.getNodeParameter('inputText', i) as string;
					const requestSource = this.getNodeParameter('requestSource', i) as string;
					const credentials = await this.getCredentials('javelinGuardrailsApi');

					const body = {
						input: {
							text: inputText,
						},
						metadata: {
							request_source: requestSource,
						},
					};

					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'javelinGuardrailsApi',
						{
							method: 'POST',
							baseURL: credentials.baseUrl as string,
							url: '/v1/guardrails/apply',
							body,
							json: true,
						},
					);

					// Check if any assessment has request_reject: true
					const hasRejection = response.assessments?.some((assessment: any) => {
						return Object.values(assessment).some((filter: any) =>
							filter.request_reject === true
						);
					});

					if (hasRejection) {
						throw new Error('Request rejected by Javelin Guardrails: Content failed security assessment');
					}

					returnData.push({
						json: response,
						pairedItem: { item: i },
					});
				} catch (error) {
					if (this.continueOnFail()) {
						returnData.push({
							json: { error: error.message },
							pairedItem: { item: i },
						});
						continue;
					}
					throw error;
				}
			}
		}

		return [returnData];
	}
}