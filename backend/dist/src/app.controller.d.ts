import { AppService } from './app.service';
export type DOMAIN = {
    id: number;
    name: string;
};
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getDomains(): Promise<Array<DOMAIN>>;
    getFacts(domains: Array<DOMAIN>): Promise<Array<string>>;
}
