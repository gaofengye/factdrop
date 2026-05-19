import { DOMAIN } from './app.controller';
export declare class AppService {
    pool: any;
    model: any;
    constructor();
    getHello(): string;
    getDomains(): Promise<Array<DOMAIN>>;
    getFacts(domains: Array<DOMAIN>): Promise<Array<string>>;
}
