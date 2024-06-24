import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from 'src/services/jwt.service';

@Module({
  imports:[
    SequelizeModule.forFeature([User]),
    JwtModule
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
})
export class UsersModule {
  
}
