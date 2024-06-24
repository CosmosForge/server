import { Controller, Get, UseGuards } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { AuthGuard } from 'src/guards/auth.guard';


@UseGuards(AuthGuard)
@Controller('logger')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Get()
  async findAll() {
    return await this.loggerService.findAll();
  }

}
