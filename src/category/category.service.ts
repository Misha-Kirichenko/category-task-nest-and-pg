import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateCategoryDto,
  CategoryByParamDto,
  UpdateCategoryDto,
  GetCategoriesDto,
} from './dto';
import { Category } from './entities';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  private formatParamObject(param: CategoryByParamDto) {
    return Number.isInteger(Number(param))
      ? { id: Number(param) }
      : { slug: param.toString() };
  }

  async getList(query: GetCategoriesDto): Promise<Category[]> {
    let categories: Category[];
    const page = Number(query.page) ? Number(query.page) : 1;
    const limit = 2;
    const partial: number =
      (page - 1) * (query.pageSize ? query.pageSize : limit);

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
        .limit(query.pageSize ? query.pageSize : limit)
        .orderBy(...orderBy)
        .getMany();
    } catch (_) {
      throw new BadRequestException({
        msg: 'Opps... Something went wrong',
      });
    }

    return categories;
  }

  async createCategory(categoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const newCategory = this.categoryRepository.create(categoryDto);
      return await this.categoryRepository.save(newCategory);
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
    } catch (_) {
      throw new BadRequestException({
        msg: 'Opps... Something went wrong',
      });
    }
    if (!updated)
      throw new NotFoundException({
        msg: `category is not found`,
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

  async getCategoryByParam(param: CategoryByParamDto): Promise<Category> {
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
