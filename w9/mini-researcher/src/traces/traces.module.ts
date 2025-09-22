import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TracesController } from './traces.controller';
import { TracesService } from './traces.service';
import { TraceSchema } from './trace.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Trace', schema: TraceSchema }]),
  ],
  controllers: [TracesController],
  providers: [TracesService],
  exports: [TracesService],
})
export class TracesModule {}
  