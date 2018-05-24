import { Get, Controller } from '@nestjs/common';
import { HttpClient, speech } from 'baidu-aip-sdk';
import { Subject } from 'rxjs';
import { writeFileSync, readFile, readdirSync, createWriteStream, createReadStream, mkdir, exists, unlink, rmdir } from 'fs';

@Controller('voice')
export class VoiceController {
  // 可配置自己的账户信息
  APP_ID = '10728164';
  API_KEY = 'CdozbzFt8WSR8AaRH4Pa9iQR';
  SECRET_KEY = '183d0523c2fa5975887c24482a82e335';
  // 文字对象
  text;
  // 百度语音客户端
  client = new speech(this.APP_ID, this.API_KEY, this.SECRET_KEY);
  // 不含尾缀的文件名
  fileName;
  // 将文字对象每500字截断的数组对象
  fieldArray = [];
  // 语音合成序号
  translateIndex = 0;
  // 合成后的所有MP3文件集合（从文件夹读取）
  files;
  // 合成后的所有MP3文件集合（copy对象用来合并）
  clips = [];
  // 文件流
  stream;
  // 合并文件时，当前处理文件的文件名
  currentfile;
  // 目标文件
  targetFile;
  subject;
  constructor() { }

  @Get()
  root(res) {
    this.subject = new Subject();
    this.subject.subscribe({
      next: (msg) => {
        return msg;
      },
    });
    this.fileName = 'test';
    this.fieldArray = [];
    this.getText().then(text => {
      this.text = text;
      this.translateIndex = 0;
      this.writeFile();
    });
  }
  // 从指定路径中获取文字对象，超过500字分割成数组
  getText() {
    return new Promise((resolve, reject) => {
      const pathname = 'txt/test.txt';
      this.fileName = 'test';
      readFile(pathname, 'utf-8', (err, data) => {
        if (err) {
        }
        else {
          const n = 500;
          for (let i = 0, l = data.length; i < l / n; i++) {
            this.fieldArray.push(data.slice(n * i, n * (i + 1)));
          }
          exists('audio/' + this.fileName, hasFile => {
            if (!hasFile) {
              mkdir('audio/' + this.fileName, () => {
                resolve();
              });
            } else {
              resolve();
            }
          });
        }
      });
    });
  }
  // 根据文字数组转换成多个MP3文件
  writeFile() {
    if (this.fieldArray[this.translateIndex]) {
      console.log(this.translateIndex);
      this.client.text2audio(this.fieldArray[this.translateIndex], { spd: 5, per: 3 }).then(result => {
        if (result.data) {
          writeFileSync('audio/' + this.fileName + '/' + this.translateIndex + '.mp3', result.data);
          if (this.fieldArray.length > 0) {
            this.translateIndex++;
            this.writeFile();
          }
        } else {
          // 服务发生错误
        }
      }, e => {
        // 发生网络错误
      });
    } else {
      this.sortFiles();
    }
  }
  // 从生成MP3路径读取所有文件并排序
  sortFiles() {
    this.files = readdirSync('audio/' + this.fileName);
    this.targetFile = createWriteStream('audio/' + this.fileName + '.mp3');
    // create an array with filenames (time)
    this.files.sort((a, b) => {
      return a.split('.')[0] - b.split('.')[0];
    });
    this.files.forEach(file => {
      this.clips.push(file);
    });
    this.mergeFile();
  }
  // 合并所有MP3文件
  mergeFile() {
    this.currentfile = 'audio/' + this.fileName + '/' + this.clips.shift();
    this.stream = createReadStream(this.currentfile);
    this.stream.pipe(this.targetFile, { end: false });
    this.stream.on('end', () => {
      console.log(this.currentfile + ' appened');
      unlink(this.currentfile, () => { });
      if (!this.clips.length) {
        this.targetFile.end('Done');
        rmdir('audio/' + this.fileName, () => { });
        this.subject.next('生成mp3');
      } else {
        this.mergeFile();
      }
    });
  }
}
