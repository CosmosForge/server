import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {} 
  use(req: Request, res: Response, next: () => void) {
    if(req["query"].reg === "true"){
      this.logger.create(req.url.split("?")[0], req.method)
    }
    next();
  }
}
