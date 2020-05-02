import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findByName(name: string): Promise<Category | null> {
    const findCategory = await this.findOne({
      where: { title: name },
    });

    return findCategory || null;
  }
}

export default CategoriesRepository;
