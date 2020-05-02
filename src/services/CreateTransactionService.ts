import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

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

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError('You do not have enough balance');
    }

    let transactionCategory = await categoryRepository.findByName(category);

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({ title: category });
      transactionCategory = await categoryRepository.save(transactionCategory);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: transactionCategory.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
