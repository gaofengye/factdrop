import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

export type DOMAIN = {
  id: number;
  name: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("domains")
  getDomains(): Promise<Array<DOMAIN>> {
    return this.appService.getDomains();
  }

  @Get("facts")
  getFacts(@Query() domains: Array<DOMAIN>): Promise<Array<string>> {
      return this.appService.getFacts(domains);
    }
}
