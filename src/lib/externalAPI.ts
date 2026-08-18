/**
 * externalAPI.ts — Enterprise OpenAPI 3.0 Specification & CLI Runner
 * JurisTech Solutions Enterprise Architecture
 */

export const OPENAPI_30_SPEC = {
  openapi: '3.0.0',
  info: {
    title: 'JurisTech Solutions Enterprise Legal API',
    version: '1.0.0',
    description: 'RESTful API for Enterprise ERP/CRM integration (SAP, Oracle Dynamics, Salesforce) providing automated contract risk auditing and statutory compliance.',
  },
  servers: [
    {
      url: 'https://www.juristech.solutions/api/v1',
      description: 'Production Global Edge Cluster',
    },
  ],
  security: [
    {
      BearerAuth: [],
    },
  ],
  paths: {
    '/contracts/audit': {
      post: {
        summary: 'Sub-second AI Contract Risk Audit',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  contractText: { type: 'string', example: 'Contract clause content...' },
                  jurisdiction: { type: 'string', example: 'GCC' },
                },
                required: ['contractText'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Successful contract audit evaluation' },
          '401': { description: 'Unauthorized — Invalid Bearer Token' },
        },
      },
    },
  },
};

export function generateOpenAPIDocumentation(): string {
  return JSON.stringify(OPENAPI_30_SPEC, null, 2);
}
