import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto, UpdateCategoryDto, GetCategoriesDto } from './dto';
import { Category } from './entities';

@Injectable()
export class CategoryService {
  defaultPageSize: number;
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {
    this.defaultPageSize = 4;
  }

  private formatParamObject(param: string) {
    return Number.isInteger(Number(param))
      ? { id: Number(param) }
      : { slug: param.toString() };
  }

  async getList(query: GetCategoriesDto): Promise<Category[]> {
    let categories: Category[];
    const page = Number(query.page) ? Number(query.page) : 1;
    const partial: number =
      (page - 1) * (query.pageSize ? query.pageSize : this.defaultPageSize);

    const orderBy: [string, 'ASC' | 'DESC'] = query.sort
      ? [
          query.sort.replace(/-/g, ''),
          query.sort.startsWith('-') ? 'DESC' : 'ASC',
        ]
      : [`"createdDate"`, 'DESC'];

    let bindString = query.search
      ? `(unaccent(name) iLike unaccent(:name) OR unaccent(description) iLike unaccent(:description)) ${
          query.hasOwnProperty('active') ? 'AND active = :active' : ''
        }`
      : query.name && query.description
      ? `(unaccent(name) iLike unaccent(:name) OR unaccent(description) iLike unaccent(:description)) ${
          query.hasOwnProperty('active') ? 'AND active = :active' : ''
        }`
      : `${
          (query.name && '(unaccent(name) iLike unaccent(:name))') ||
          (query.description &&
            '(unaccent(description) iLike unaccent(:description))') ||
          ''
        }`;

    bindString += query.hasOwnProperty('active')
      ? ` ${bindString.length ? ' AND ' : ''} active = :active`
      : '';

    let bindParams = query.search
      ? {
          name: `%${query.search}%`,
          description: `%${query.search}%`,
        }
      : {
          ...(query.name && { name: `%${query.name}%` }),
          ...(query.description && { description: `%${query.description}%` }),
        };

    bindParams = {
      ...bindParams,
      ...(query.hasOwnProperty('active') && {
        active: Boolean(JSON.parse(query.active)),
      }),
    };

    try {
      categories = await this.categoryRepository
        .createQueryBuilder()
        .select()
        .where(bindString, bindParams)
        .offset(partial)
        .limit(query.pageSize ? query.pageSize : this.defaultPageSize)
        .orderBy(...orderBy)
        .getMany();
    } catch (_) {
      console.log(_);
      throw new BadRequestException({
        msg: 'Opps... Something went wrong',
      });
    }

    return categories;
  }

  async createCategory(categoryDto: CreateCategoryDto): Promise<Category> {
    let newCategory: Category;
    let foundCategory: Category;
    foundCategory = await this.categoryRepository.findOne({
      where: [{ name: categoryDto.name }, { slug: categoryDto.slug }],
    });

    if (foundCategory)
      throw new ConflictException({
        msg: 'Category with the same slug or name already exists',
      });

    try {
      newCategory = this.categoryRepository.create(categoryDto);
      await this.categoryRepository.save(newCategory);
      return newCategory;
    } catch (_) {
      throw new BadRequestException({
        msg: 'Opps... Something went wrong',
      });
    }
  }

  async updateCategory(
    id: number,
    categoryDto: UpdateCategoryDto,
  ): Promise<{ msg: string }> {
    let updated: number;
    try {
      const { affected } = await this.categoryRepository.update(
        {
          id,
        },
        categoryDto,
      );
      updated = affected;
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException({
          msg: 'Category with same name or slug already exists',
        });

      throw new BadRequestException({
        msg: 'Opps... Something went wrong',
      });
    }

    if (!updated)
      throw new NotFoundException({
        msg: `category was not found`,
      });

    return { msg: 'category was successfully updated' };
  }

  async deleteCategory(id: number): Promise<{ msg: string }> {
    let deleted: number;
    try {
      const { affected } = await this.categoryRepository.delete({ id });
      deleted = affected;
    } catch (_) {
      throw new BadRequestException({
        msg: 'Opps... Something went wrong',
      });
    }

    if (!deleted)
      throw new NotFoundException({
        msg: `category was not found`,
      });

    return { msg: `category removed successfully` };
  }

  async getCategoryByParam(param: string): Promise<Category> {
    const paramObj = this.formatParamObject(param);
    let found: Category;
    try {
      found = await this.categoryRepository.findOneBy(paramObj);
    } catch (_) {
      throw new BadRequestException({
        msg: 'Opps... Something went wrong',
      });
    }

    if (!found)
      throw new NotFoundException({
        msg: `category was not found`,
      });

    return found;
  }
}
