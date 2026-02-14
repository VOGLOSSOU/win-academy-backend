import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnswerDto {
  @ApiProperty({ example: 'Réponse correcte' })
  @IsString()
  @IsNotEmpty()
  answerText!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  isCorrect!: boolean;
}

export class UpdateAnswerDto {
  @ApiPropertyOptional({ example: 'Nouvelle réponse' })
  @IsOptional()
  @IsString()
  answerText?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;
}
