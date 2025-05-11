import { ExpoConfig } from '@expo/config';

export default ({ config }: { config: ExpoConfig }): ExpoConfig => {
  return {
    ...config,
    extra: {
      SERVER_URL: process.env.SERVER_URL,
    },
  };
};