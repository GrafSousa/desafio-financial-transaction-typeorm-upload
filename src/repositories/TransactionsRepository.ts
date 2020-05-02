import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = this.sumTransactionValueByType(transactions, 'income');
    const outcome = this.sumTransactionValueByType(transactions, 'outcome');
    const total = income - outcome;

    return { income, outcome, total };
  }

  private sumTransactionValueByType(
    transactions: Transaction[],
    type: 'income' | 'outcome',
  ): number {
    return transactions
      .filter(transaction => transaction.type === type)
      .reduce((sum, transaction) => sum + transaction.value, 0);
  }
}

export default TransactionsRepository;
