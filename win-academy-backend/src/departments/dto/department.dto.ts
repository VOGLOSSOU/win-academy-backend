import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Atlantique' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'ATL' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  code?: string;
}

export class UpdateDepartmentDto {
  @ApiPropertyOptional({ example: 'Atlantique' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'ATL' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  code?: string;
}
