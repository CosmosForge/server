import { Injectable } from '@nestjs/common';
import {resolve, join} from "path"
import * as fs from "fs"
function getPathRoot(path){
  const parentDir = resolve(global.appRoot, '..');
  const targetFolder = `public/${path}`;
  const targetFolderPath = join(parentDir, targetFolder);
  return targetFolderPath
}
@Injectable()
export class AppService {
  async getPartyImages(party: number): Promise<string[]> {

    try {
      const files = await fs.promises.readdir(getPathRoot("imgs"));
      let returnFiles:string[] = []
      let sendLendth = 4
      for(let i = 0; i < sendLendth; i++){
        if(files[party*sendLendth+i]){
          returnFiles.push(files[party*sendLendth+i])
        }
      }
      return returnFiles;
    } catch (err) {
      console.error('Error reading directory:', err.message);
      throw err;
    }
  }
}
