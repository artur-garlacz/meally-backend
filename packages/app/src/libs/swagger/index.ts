import { AppConfig } from '../utils/config';

export type CreateSwaggerSpec = Pick<AppConfig, 'swaggerConfig'>;
export type SwaggerClient = ReturnType<typeof createSwaggerClient>;

export function createSwaggerClient({ swaggerConfig }: CreateSwaggerSpec) {
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: '1.0.0',
        title: 'Customer API',
        description: 'Customer API Information',
        contact: {
          name: 'Amazing Developer',
        },
        servers: [`http://${swaggerConfig.host}:${swaggerConfig.port}`],
      },
    },
    // ['.routes/*.js']
    apis: ['../../api/router.ts'],
  };

  return {
    swaggerOptions,
  };
}
