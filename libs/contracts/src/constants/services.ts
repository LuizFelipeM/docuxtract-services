interface ServiceConfig {
  queue: string;
}

export enum Services {
  Auth = 'AUTH',
  EmailInt = 'EMAIL_INT',
}

export const ServicesConfigs: Record<Services, ServiceConfig> = {
  AUTH: {
    queue: 'auth',
  },
  EMAIL_INT: {
    queue: 'email-int',
  },
};
