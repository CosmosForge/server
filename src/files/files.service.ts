import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as fs from 'fs';
import { Folder, File } from './entities/files.entity';
import { Op, Sequelize } from 'sequelize';
@Injectable()
export class FilesService {
  constructor(
    @InjectModel(Folder)
    private readonly folder: typeof Folder,
    @InjectModel(File)
    private readonly file: typeof File
  ) { }
  initialFilesDirs() {
    const dirs = ['imgs-uploads', 'imgs-swipers', 'archives', 'css', 'js', 'videos']
    dirs.forEach(value => {
      this.folder.findOrCreate({
        where: { name: value },
        defaults: {
          name: value,
          main: true
        },
      })
    })
  }
  async createFolder(dirName: string, name: string) {
    let folder = await this.folder.findOne({
      where: {
        name: `${dirName}-${name}`
      }
    })
    if (!folder) {
      if (!fs.existsSync(`public/${dirName.replaceAll("-", "/")}/${name}`))
        fs.mkdirSync(`public/${dirName.replaceAll("-", "/")}/${name}`);
      return await this.folder.create({ name: `${dirName}-${name}` })
    } else {
      return null
    }
  }
  async deleteFolder(id: number) {
    const folder = await this.folder.findByPk(id)
    if(folder){
      fs.rmSync(`public/${folder?.name?.replaceAll("-", "/")}`, { recursive: true, force: true });
      await folder.destroy()
      return true
    }
    return false
  }
  async saveFile(dirName: string, fileName: string, fileResolution: string, fileSize: number, originalName: string) {
    let file: File | null;
    const folder = await this.folder.findOne({
      where: { name: dirName.toLowerCase() }
    })
    if (folder) {
      file = await this.file.findOne({ where: { aliasName: originalName.toLowerCase() } })
      const body = {
        aliasName: "",
        fileName: fileName.toLowerCase(),
        fileResolution,
        fileSize,
        folderId: folder.id
      }
      if (!file) {
        body.aliasName = originalName.toLowerCase()
      } else {
        body.aliasName = fileName.toLowerCase()
      }
      file = await this.file.create(body)
    }
    return file
  }
  async getSubFolder(dir: string): Promise<Folder[]> {
    return await this.folder.findAll({
      where: {
        name: {
          [Op.and]: [
            { [Op.like]: `${dir}-%` },
            { [Op.notLike]: `${dir}-%/%` }
          ]
        }
      }
    });
  }
  async getAllSubFolderFiles(): Promise<Folder[]> {
    
    const folder = await this.folder.findAll({
      where: {
        name: {
          [Op.and]: [
            { [Op.like]: `imgs-swipers-%` },
            { [Op.notLike]: `imgs-swipers-%/%` }
          ]
        }
      },
      include: [File],
    });
    return folder
  }
  async getFiles(dir: string): Promise<File[]> {
    const folder = await this.folder.findOne({
      where: { name: dir.toLowerCase() },
      include: [File],
    });
    return folder?.files;
  }
  async renameFile(name: string, renameName: string) {
    const checkRenamedName = await this.file.findOne({ where: { aliasName: renameName.toLowerCase() } });
    if (!checkRenamedName) {
      const file = await this.file.findOne({ where: { aliasName: name.toLowerCase() } });
      file.aliasName = renameName.toLowerCase()
      await file.save()
      return file
    } else {
      return false
    }
  }
  async changeFileCntent(dir: string, fileName: string, content: string) {
    const file = await this.file.findOne({ where: { fileName } });
    if (file) {
      fs.writeFileSync(process.cwd() + `/public/${dir.replaceAll("-", "/")}/${file.fileName}`, content)
      return true
    } else {
      return false
    }
  }
  async deleteFile(dirName: string, fileId: number) {
    try {
      const file = await this.file.findByPk(fileId)
      fs.unlinkSync(`./public/${dirName.toLowerCase().replaceAll("-", "/")}/${file.fileName}`)
      await file.destroy()
      return true
    } catch (error) {
      return false
    }
  }
}
