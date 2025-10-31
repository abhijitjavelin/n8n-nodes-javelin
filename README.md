# n8n-nodes-javelin

This is an n8n community node for Javelin Guardrails. It lets you apply AI safety and content moderation to your n8n workflows.

[Javelin](https://docs.getjavelin.io/) is an AI production platform providing centralized guardrails for LLM-forward enterprises.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

**Javelin Guardrails**
- Apply multiple guardrails to text content including:
  - **Prompt Injection Detection**: Detects manipulation attempts and jailbreak attacks
  - **Trust & Safety**: Screens for violence, hate speech, profanity, and harmful content
  - **Language Detection**: Validates content language policies
  - **Security Filters**: Detects code, invisible characters, and non-ASCII content

The node automatically stops workflow execution if any guardrail returns `request_reject: true`.

## Credentials

Configure your Javelin Guardrails API credentials:

1. **Base URL**: Your Javelin API endpoint (defaults to `https://api-dev.javelin.live`)
2. **API Key**: Your Javelin API key

### Getting API Credentials

1. Sign up at [Javelin](https://www.getjavelin.com/)
2. Navigate to your API settings to generate an API key
3. Copy the API key and base URL for your environment

## Compatibility

Compatible with n8n@1.60.0 or later

## Resources

* [Javelin Documentation](https://docs.getjavelin.io/)
* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)