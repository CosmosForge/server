import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from "argon2"
import { JwtService } from '../services/jwt.service';
import { Response } from 'express';
import * as dotenv from "dotenv"
import { Op } from 'sequelize';
import { AuthGuard } from '../guards/auth.guard';
dotenv.config()

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}
  @UseGuards(AuthGuard)
  @Get("check-user")
  async checkUser(){
    return true
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.usersService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Post('login')
  async login(@Body() body:any, @Res() res: Response) {
    const user = await this.usersService.findOneByPayload({[Op.or]: [{name: body.user}, {email: body.user}]});
    if (!user) {
      res.status(403).send({field: 1});
      return null
    }
    const passwordStatus = await argon2.verify(user.password, body.password)
    if (!passwordStatus) {
      res.status(403).send({field: 2});
      return null
    }
    const token = this.jwtService.generateToken({ sub: user.id, username: user.name }, process.env.TOKEN_EXPIRATION);
    res.cookie('token', token, { httpOnly: true });
    res.status(200).send({status: true});
    return null
  }
  @Post("logout")
  async logout(@Res() res: Response){
    res.cookie('token', '', { expires: new Date(0), httpOnly: true });
    res.status(200).send({message:'Logout successful.'});
  }
}
