import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('Status Check')
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
