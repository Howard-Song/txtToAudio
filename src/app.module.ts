import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VoiceModule } from '.';

@Module({
  imports: [VoiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
