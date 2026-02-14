import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
import { UpdateAnswerDto } from './dto/answer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, UserRole } from '../common/decorators/roles.decorator';

@ApiTags('Questions')
@Controller('questions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  /**
   * Create a new question with answers
   * Admin only
   */
  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new question with answers' })
  create(@Body() data: CreateQuestionDto) {
    return this.questionsService.create(data);
  }

  /**
   * Get all questions with pagination
   */
  @Get()
  @ApiOperation({ summary: 'Get all questions with pagination' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.questionsService.findAll(+page, +limit);
  }

  /**
   * Get questions by evaluation ID
   */
  @Get('evaluation/:evaluationId')
  @ApiOperation({ summary: 'Get all questions for a specific evaluation' })
  @ApiParam({ name: 'evaluationId', type: String })
  findByEvaluation(@Param('evaluationId') evaluationId: string) {
    return this.questionsService.findByEvaluation(evaluationId);
  }

  /**
   * Get a single question by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single question by ID' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  /**
   * Update a question
   * Admin only
   */
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a question' })
  @ApiParam({ name: 'id', type: String })
  update(@Param('id') id: string, @Body() data: UpdateQuestionDto) {
    return this.questionsService.update(id, data);
  }

  /**
   * Delete a question
   * Admin only
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a question' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }

  /**
   * Add an answer to a question
   * Admin only
   */
  @Post(':questionId/answers')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Add an answer to a question' })
  @ApiParam({ name: 'questionId', type: String })
  addAnswer(
    @Param('questionId') questionId: string,
    @Body() data: { answerText: string; isCorrect: boolean },
  ) {
    return this.questionsService.addAnswer(
      questionId,
      data.answerText,
      data.isCorrect,
    );
  }

  /**
   * Update an answer
   * Admin only
   */
  @Patch('answers/:answerId')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update an answer' })
  @ApiParam({ name: 'answerId', type: String })
  updateAnswer(@Param('answerId') answerId: string, @Body() data: UpdateAnswerDto) {
    return this.questionsService.updateAnswer(answerId, data);
  }

  /**
   * Delete an answer
   * Admin only
   */
  @Delete('answers/:answerId')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete an answer' })
  @ApiParam({ name: 'answerId', type: String })
  removeAnswer(@Param('answerId') answerId: string) {
    return this.questionsService.removeAnswer(answerId);
  }
}
