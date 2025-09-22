import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { DocumentsModule } from './documents/documents.module';
// import { QuestionsModule } from './questions/questions.module';
// import { TracesModule } from './traces/traces.module';
import { WorkflowModule } from './workflow/workflow.module';
import { DocumentsModule } from './documents/documents.module';
import { QuestionsModule } from './questions/questions.module';
import { TracesModule } from './traces/traces.module';
import { ConfigModule } from '@nestjs/config';
// import { WorkflowModule } from './workflow/workflow.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    DocumentsModule,
    QuestionsModule,
    TracesModule,
    WorkflowModule,
  ],
})
export class AppModule {}
