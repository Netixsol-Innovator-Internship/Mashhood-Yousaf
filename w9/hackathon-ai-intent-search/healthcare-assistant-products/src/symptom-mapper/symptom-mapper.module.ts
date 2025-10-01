// src/symptom-mapper/symptom-mapper.module.ts
import { Module } from '@nestjs/common';
import { SymptomMapperService } from './symptom-mapper.service';

@Module({
  providers: [SymptomMapperService],
  exports: [SymptomMapperService],
})
export class SymptomMapperModule {}
