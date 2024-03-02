import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import * as fs from "fs"
import * as puppeteer from 'puppeteer';
import { Pages } from './entities/pages.entity';
import { AppService } from 'src/app.service';

@Injectable()
export class PagesService {
    constructor(
        @InjectModel(Pages)
        private readonly page: typeof Pages,
    ) {}

    async create(pageName:string):Promise<Pages>{
        return await this.page.create({pageName:pageName})
    }
    async findAll(where = {}):Promise<Pages[]>{
        return await this.page.findAll({where})
    }
    async findById(id:number):Promise<Pages>{
        return await this.page.findOne({where:{id}})
    }
    async update(id:number, options:{}){
        return await this.page.update(options, {where:{id}})
    }
    async delete(id:number):Promise<boolean>{
        await this.page.destroy({where:{id}})
        return true
    }
    async getPageSchema(fileName:string){
        return await fs.promises.readFile(process.cwd()+`/pagesSchema/${fileName}/${fileName}.schema.json`,"utf8")
    }

    async createPageSnapshot(url:string, id:number, host: string){
        
        const updatedPage = await this.page.findOne({where:{id}})
        const browser = await puppeteer.launch();
        const pageSnapshot = await browser.newPage();
        await pageSnapshot.setViewport({ width: 1920, height: 1080 });
        await pageSnapshot.goto(url);
        const screenshot = await pageSnapshot.screenshot({ path: process.cwd()+`/public/pages/${updatedPage.pageName}.png` });
        await browser.close();
        updatedPage.pageImg = `${host}/static/pages/${updatedPage.pageName}.png`;
        updatedPage.save();
        return updatedPage;
    }
}
