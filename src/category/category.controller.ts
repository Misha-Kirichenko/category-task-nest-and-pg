import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { GetCategoriesDto, CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from './entities';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiResponse({
    status: 200,
    description: 'returns all categories list/category list found by filter',
    type: Category,
    isArray: true,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        msg: 'Ooops...Something went wrong',
      },
    },
    description: 'Uncategorized error',
  })
  @ApiTags('Get all category list or by filter')
  @Get()
  getAllCategories(@Query() query: GetCategoriesDto): Promise<Category[]> {
    return this.categoryService.getList(query);
  }

  @ApiOkResponse({
    schema: {
      type: 'object',
      example: {
        msg: 'category was successfully deleted',
      },
    },
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        msg: 'Ooops...Something went wrong',
      },
    },
    description: 'Uncategorized error',
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      example: {
        msg: 'category was not found',
      },
    },
    description: 'category was not found',
  })
  @ApiTags('Delete category')
  @Delete(':id')
  deleteCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ msg: string }> {
    return this.categoryService.deleteCategory(id);
  }

  @ApiResponse({
    status: 201,
    description: 'category was successfully created',
    type: Category,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        statusCode: 400,
        message: [
          'name must be a string',
          "name must match /^(?:[A-Za-z\\s?!,\\-.']|[а-яА-Я\\s?!,\\-.'Ёё])+$/g regular expression",
          'description must be a string',
          "description must match /^(?:[A-Za-z\\s?!,\\-.']|[а-яА-Я\\s?!,\\-.'Ёё])+$/g regular expression",
          'active must be a boolean value',
        ],
        error: 'Bad Request',
      },
    },
    description: 'Body validation errors',
  })
  @ApiConflictResponse({
    schema: {
      type: 'object',
      example: {
        msg: 'Category with the same slug or name already exists',
      },
    },
    description: 'Conflict response',
  })
  @ApiTags('Create new category')
  @Post()
  async createCategory(
    @Body() categoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.createCategory(categoryDto);
  }

  @ApiOkResponse({
    status: 201,
    schema: {
      type: 'object',
      example: {
        msg: 'category was successfully updated',
      },
    },
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        statusCode: 400,
        message: [
          'name must be a string',
          "name must match /^(?:[A-Za-z\\s?!,\\-.']|[а-яА-Я\\s?!,\\-.'Ёё])+$/g regular expression",
          'description must be a string',
          "description must match /^(?:[A-Za-z\\s?!,\\-.']|[а-яА-Я\\s?!,\\-.'Ёё])+$/g regular expression",
          'active must be a boolean value',
        ],
        error: 'Bad Request',
      },
    },
    description: 'Body validation errors',
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      example: {
        msg: 'category was not found',
      },
    },
    description: 'category was not found',
  })
  @ApiConflictResponse({
    schema: {
      type: 'object',
      example: {
        msg: 'Category with the same slug or name already exists',
      },
    },
    description: 'Conflict response',
  })
  @ApiTags('Update category')
  @Patch(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() categoryDto: UpdateCategoryDto,
  ): Promise<{ msg: string }> {
    return await this.categoryService.updateCategory(id, categoryDto);
  }

  @ApiOkResponse({
    description: 'returns category found by id/slug',
    type: Category,
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      example: {
        msg: 'category was not found',
      },
    },
    description: 'category not found',
  })
  @ApiTags('Get category by id/slug')
  @Get('/:param')
  getCategoryByParam(@Param('param') param: string): Promise<Category> {
    return this.categoryService.getCategoryByParam(param);
  }
}
