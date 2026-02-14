import { IsString, IsNotEmpty, IsOptional, IsUUID, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAnswerDto } from './answer.dto';

export class CreateQuestionDto {
  @ApiProperty({ example: 'Quelle est la capitale du Benin ?' })
  @IsString()
  @IsNotEmpty()
  questionText!: string;

  @ApiProperty({ example: 'uuid-evaluation' })
  @IsUUID()
  @IsNotEmpty()
  evaluationId!: string;

  @ApiProperty({ type: [CreateAnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateAnswerDto)
  answers!: CreateAnswerDto[];
}

export class UpdateQuestionDto {
  @ApiPropertyOptional({ example: 'Nouvelle question' })
  @IsOptional()
  @IsString()
  questionText?: string;
}
