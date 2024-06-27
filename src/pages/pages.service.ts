import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as fs from "fs"
import * as puppeteer from 'puppeteer';
import { Pages } from './entities/pages.entity';

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(Pages)
    private readonly page: typeof Pages,
  ) { }
  initialPage() {
    this.page.findOrCreate({
      where: { pageName: "home" },
      defaults: { pageName: "home" }
    })
    if (!fs.existsSync(process.cwd() + `/schemas/pages/home.json`))
      fs.writeFileSync(process.cwd() + `/schemas/pages/home.json`, JSON.stringify({
        "head": {
          "js": [],
          "css": [],
          "title": "",
          "description": "",
          "tags": []
        },
        "body": {
          "main": {
            "update": false,
            "children": [
              {
                "type": "section",
                "properties": {
                  "class": " section"
                },
                "styles": "align-items: center;",
                "children": [
                  {
                    "type": "area",
                    "properties": {
                      "class": " area "
                    },
                    "styles": "width: 60%;",
                    "children": [
                      {
                        "type": "title",
                        "properties": {
                          "text": "Welcome to the home page",
                          "class": " title",
                          "titleType": "h1"
                        },
                        "styles": "",
                        "children": []
                      },
                      {
                        "type": "paragraph",
                        "properties": {
                          "text": "Someone's history will be made here. Enjoy watching",
                          "class": " paragraph"
                        },
                        "styles": "",
                        "children": []
                      }
                    ]
                  },
                  {
                    "type": "area",
                    "properties": {
                      "class": " area"
                    },
                    "styles": "width: 35%;",
                    "children": [
                      {
                        "type": "list",
                        "properties": {
                          "class": " list"
                        },
                        "styles": "flex-direction: column;",
                        "children": [
                          [
                            {
                              "type": "img",
                              "properties": {
                                "text": "",
                                "class": " img",
                                "src": "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
                              },
                              "styles": "",
                              "children": []
                            }
                          ],
                          [
                            {
                              "type": "img",
                              "properties": {
                                "text": "",
                                "class": " img",
                                "src": "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
                              },
                              "styles": "",
                              "children": []
                            }
                          ]
                        ]
                      }
                    ]
                  }
                ]
              }
            ],
            "html": "<section placeholder=\"\" class=\"element section\" style=\"align-items: center;\" dropzone=\"true\"><div class=\"borders\"><div class=\"border border1 active\"></div><div class=\"border border2 active\"></div><div class=\"border border3 active\"></div><div class=\"border border4 active\"></div></div><div class=\"funcBtns\"><img src=\"assets/imgs/constructor/move.png\" alt=\"\" class=\"move\"><img src=\"assets/imgs/constructor/configuration.png\" alt=\"\" class=\"configurator\"><img src=\"assets/imgs/constructor/delete.png\" alt=\"\" class=\"delete\"></div><div placeholder=\"\" class=\"element area active\" style=\"width: 60%;\" dropzone=\"true\"><div class=\"borders\"><div class=\"border border1 active\"></div><div class=\"border border2 active\"></div><div class=\"border border3 active\"></div><div class=\"border border4\"></div></div><div class=\"funcBtns\"><img src=\"assets/imgs/constructor/move.png\" alt=\"\" class=\"move\"><img src=\"assets/imgs/constructor/configuration.png\" alt=\"\" class=\"configurator\"><img src=\"assets/imgs/constructor/delete.png\" alt=\"\" class=\"delete\"></div><div placeholder=\"title\" class=\"element title\" style=\"\"><div class=\"borders\"><div class=\"border border1\"></div><div class=\"border border2\"></div><div class=\"border border3\"></div><div class=\"border border4\"></div></div><div class=\"funcBtns\"><img src=\"assets/imgs/constructor/move.png\" alt=\"\" class=\"move\"><img src=\"assets/imgs/constructor/configuration.png\" alt=\"\" class=\"configurator\"><img src=\"assets/imgs/constructor/delete.png\" alt=\"\" class=\"delete\"></div><h1 contenteditable=\"true\" class=\"active\">Welcome to the home page</h1></div><div placeholder=\"paragraph\" class=\"element paragraph\" style=\"\"><div class=\"borders\"><div class=\"border border1 active\"></div><div class=\"border border2\"></div><div class=\"border border3\"></div><div class=\"border border4 active\"></div></div><div class=\"funcBtns\"><img src=\"assets/imgs/constructor/move.png\" alt=\"\" class=\"move\"><img src=\"assets/imgs/constructor/configuration.png\" alt=\"\" class=\"configurator\"><img src=\"assets/imgs/constructor/delete.png\" alt=\"\" class=\"delete\"></div><p contenteditable=\"true\">Someone's history will be made here. Enjoy watching</p></div></div><div placeholder=\"\" class=\"element area\" style=\"width: 35%;\" dropzone=\"true\"><div class=\"borders\"><div class=\"border border1 active\"></div><div class=\"border border2 active\"></div><div class=\"border border3 active\"></div><div class=\"border border4 active\"></div></div><div class=\"funcBtns\"><img src=\"assets/imgs/constructor/move.png\" alt=\"\" class=\"move\"><img src=\"assets/imgs/constructor/configuration.png\" alt=\"\" class=\"configurator\"><img src=\"assets/imgs/constructor/delete.png\" alt=\"\" class=\"delete\"></div><div class=\"element list\" style=\"flex-direction: column;\"><div class=\"borders\"><div class=\"border border1\"></div><div class=\"border border2\"></div><div class=\"border border3 active\"></div><div class=\"border border4\"></div></div><div class=\"funcBtns\"><img src=\"assets/imgs/constructor/move.png\" alt=\"\" class=\"move\"><img src=\"assets/imgs/constructor/configuration.png\" alt=\"\" class=\"configurator\"><img src=\"assets/imgs/constructor/delete.png\" alt=\"\" class=\"delete\"></div><ul style=\"flex-direction: column;\"><li class=\"element\" dropzone=\"true\" placeholder=\"\"><div placeholder=\"img\" class=\"element img\" style=\"\"><div class=\"borders\"><div class=\"border border1\"></div><div class=\"border border2\"></div><div class=\"border border3\"></div><div class=\"border border4\"></div></div><div class=\"funcBtns\"><img src=\"assets/imgs/constructor/move.png\" alt=\"\" class=\"move\"><img src=\"assets/imgs/constructor/configuration.png\" alt=\"\" class=\"configurator\"><img src=\"assets/imgs/constructor/delete.png\" alt=\"\" class=\"delete\"></div><img src=\"https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg\"></div></li><li class=\"element\" dropzone=\"true\" placeholder=\"\"><div placeholder=\"img\" class=\"element img\" style=\"\"><div class=\"borders\"><div class=\"border border1\"></div><div class=\"border border2\"></div><div class=\"border border3\"></div><div class=\"border border4\"></div></div><div class=\"funcBtns\"><img src=\"assets/imgs/constructor/move.png\" alt=\"\" class=\"move\"><img src=\"assets/imgs/constructor/configuration.png\" alt=\"\" class=\"configurator\"><img src=\"assets/imgs/constructor/delete.png\" alt=\"\" class=\"delete\"></div><img src=\"https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg\"></div></li></ul></div></div></section>"
          }
        }
      }, null, 2))
    if (!fs.existsSync(process.cwd() + `/schemas/header.json`))
      fs.writeFileSync(process.cwd() + `/schemas/header.json`, JSON.stringify({
        body: {
          main: {
            update: false,
            children: [],
            html: ""
          },
        }
      }, null, 2))
    if (!fs.existsSync(process.cwd() + `/schemas/footer.json`))
      fs.writeFileSync(process.cwd() + `/schemas/footer.json`, JSON.stringify({
        body: {
          main: {
            update: false,
            children: [],
            html: ""
          },
        }
      }, null, 2))
    if (!fs.existsSync(process.cwd() + `/schemas/main.json`))
      fs.writeFileSync(process.cwd() + `/schemas/main.json`, JSON.stringify({
        head: {
          js: [],
          css: [],
          title: "",
          description: "",
          tags: []
        }
      }, null, 2))
  }

  async create(pageName: string): Promise<Pages> {
    const pageControl = await this.page.findOne({ where: { pageName: pageName.toLowerCase() } })
    if (pageControl != null) {
      throw new Error("")
    }
    fs.writeFile(process.cwd() + `/schemas/pages/${pageName.toLowerCase()}.json`, JSON.stringify({
      head: {
        js: [],
        css: [],
        title: "",
        description: "",
        tags: []
      },
      body: {
        main: {
          update: false,
          children: [],
          html: ""
        }
      }
    }, null, 2), err => {
      if (err) {
        console.error(err);
      } else {
      }
    });
    return await this.page.create({ pageName: pageName.toLowerCase() })
  }
  async findCount() {
    return await this.page.count()
  }
  async findAll(where = {}): Promise<Pages[]> {
    return await this.page.findAll({ where })
  }
  async findById(id: number): Promise<Pages> {
    return await this.page.findOne({ where: { id } })
  }
  async update(id: number, options: {}) {
    return await this.page.update(options, { where: { id } })
  }
  async delete(id: number): Promise<boolean> {
    const page = await this.page.findByPk(id)
    if (page) {
      if (fs.existsSync(process.cwd() + `/schemas/pages/${page.pageName}.json`))
        fs.unlinkSync(process.cwd() + `/schemas/pages/${page.pageName}.json`)
      await page.destroy()
      return true
    } else {
      return false
    }
  }
  async getGlobalSchema(fileName: string) {
    try {
      return await fs.promises.readFile(process.cwd() + `/schemas/${fileName}.json`, "utf8")
    } catch (error) {
      return null
    }
  }
  async getPageSchema(id: number) {
    try {
      const page = await this.page.findByPk(id)
      return await fs.promises.readFile(process.cwd() + `/schemas/pages/${page.pageName.toLowerCase()}.json`, "utf8")
    } catch (error) {
      return null
    }
  }
  async getGuestPageSchema(fileName: string) {
    try {
      const guestSchema = JSON.parse(await fs.promises.readFile(process.cwd() + `/schemas/pages/${fileName.toLowerCase()}.json`, "utf8"))
      delete guestSchema.body.main.html
      return guestSchema
    } catch (error) {
      return null
    }
  }
  async updateGlobalSchema(name: string, schema: any) {
    fs.writeFileSync(process.cwd() + `/schemas/${name}.json`, JSON.stringify(schema, null, 2))
    return await fs.promises.readFile(process.cwd() + `/schemas/${name}.json`, "utf8")
  }
  async updatePageSchema(id: number, schema: any) {
    const page = await this.page.findByPk(id)
    fs.writeFileSync(process.cwd() + `/schemas/pages/${page.pageName}.json`, JSON.stringify(schema, null, 2))
    return await fs.promises.readFile(process.cwd() + `/schemas/pages/${page.pageName}.json`, "utf8")
  }
  async createPageSnapshot(url: string, id: number, host: string) {
    const updatedPage = await this.page.findOne({ where: { id } })
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
      timeout: 60000 
    });
    const pageSnapshot = await browser.newPage();
    await pageSnapshot.setViewport({ width: 1920, height: 1080 });
    await pageSnapshot.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    const d = new Date()
    const date = `${d.getFullYear()}_${(d.getMonth() + 1).toString().padStart(2, '0')}_${d.getDate().toString().padStart(2, '0')}`;
    const time = `${d.getHours().toString().padStart(2, '0')}_${d.getMinutes().toString().padStart(2, '0')}_${d.getSeconds().toString().padStart(2, '0')}`;
    const text = `${date}T${time}`;
    if (updatedPage.pageImg) {
      fs.unlinkSync(`${process.cwd()}/public/pages/${updatedPage.pageImg}`)
    }
    const screenshot = await pageSnapshot.screenshot({ path: process.cwd() + `/public/pages/${updatedPage.pageName}-${text}.webp` });
    await browser.close();
    updatedPage.pageImg = `${updatedPage.pageName}-${text}.webp`;
    await updatedPage.save();
    return updatedPage;
  }
}
