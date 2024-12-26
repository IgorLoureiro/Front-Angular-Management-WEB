import { config } from 'dotenv';

config();

const local_config: any = {
    baseUrl: process.env['API_KEY'],
    environment: "Local",
};

export const enviroment: any = {
    production: false,
    config: local_config,
};