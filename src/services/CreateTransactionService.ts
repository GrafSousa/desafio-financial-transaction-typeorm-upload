import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import { Transaction } from '../models/Transaction';
import { TransactionsRepository } from '../repositories/TransactionsRepository';
import { CategoriesRepository } from '../repositories/CategoriesRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoriesRepository);

    let categoryByName = await categoryRepository.findByName(category);

    if (!categoryByName) {
      categoryByName = categoryRepository.create({ title: category });
      categoryByName = await categoryRepository.save(categoryByName);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryByName.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export { CreateTransactionService };
