import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import * as argon2 from "argon2"

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private user: typeof User
  ){}
  async initAdmin(){
    this.user.findOrCreate({
      where: { id: 1 },
      defaults: {
        name:"admin",
        email:"example@gmail.com",
        password: await argon2.hash("qwerty"),
        role:true
      },
    })
  }
  async findOne(id: number) {
    return await this.user.findByPk(id)
  }
  async findOneByPayload(where:any) {
    return await this.user.findOne({where})
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    if(updateUserDto.password != undefined) updateUserDto.password = await argon2.hash(updateUserDto.password)
    return await this.user.update(updateUserDto, {where:{id}})
  }
  
}
