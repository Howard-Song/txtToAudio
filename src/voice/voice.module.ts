import { Module, HttpModule } from '@nestjs/common';
import { VoiceController } from './voice.controller';

@Module({
  imports: [HttpModule],
  controllers: [VoiceController],
  providers: [],
})
export class VoiceModule {}
