
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, TrendingUp, TrendingDown, Edit, Trash2, FileText } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parse, isValid, getMonth, getYear } from 'date-fns';

const transactionSchema = z.object({
  date: z.string().refine(val => {
    const parsedDate = parse(val, 'dd/MM/yyyy', new Date());
    return isValid(parsedDate) && format(parsedDate, 'dd/MM/yyyy') === val;
  }, { message: "Invalid date format. Use DD/MM/YYYY." }),
  description: z.string().min(1, "Description is required."),
  amount: z.preprocess(
    (a) => parseFloat(String(a).replace(",", ".")),
    z.number().positive("Amount must be a positive number.")
  ),
  type: z.enum(['credit', 'debit'], { required_error: "Type is required." }),
});

const AccountingDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { toast } = useToast();

  const { register, handleSubmit, control, reset, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: '',
      description: '',
      amount: '',
      type: undefined,
    }
  });

  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const onSubmit = (data) => {
    const newTransaction = {
      id: editingTransaction ? editingTransaction.id : Date.now().toString(),
      ...data,
      amount: parseFloat(data.amount)
    };

    if (editingTransaction) {
      setTransactions(transactions.map(t => t.id === newTransaction.id ? newTransaction : t));
      toast({ title: "Success!", description: "Transaction updated successfully." });
    } else {
      setTransactions([...transactions, newTransaction]);
      toast({ title: "Success!", description: "Transaction added successfully." });
    }
    reset();
    setEditingTransaction(null);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setValue('date', transaction.date);
    setValue('description', transaction.description);
    setValue('amount', String(transaction.amount));
    setValue('type', transaction.type);
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast({ title: "Success!", description: "Transaction deleted successfully." });
  };

  const groupedTransactions = transactions.reduce((acc, curr) => {
    const dateObj = parse(curr.date, 'dd/MM/yyyy', new Date());
    if (!isValid(dateObj)) return acc; 
    const monthYear = format(dateObj, 'MMMM yyyy');
    if (!acc[monthYear]) {
      acc[monthYear] = { transactions: [], totalCredit: 0, totalDebit: 0 };
    }
    acc[monthYear].transactions.push(curr);
    if (curr.type === 'credit') {
      acc[monthYear].totalCredit += curr.amount;
    } else {
      acc[monthYear].totalDebit += curr.amount;
    }
    return acc;
  }, {});

  const sortedMonthYears = Object.keys(groupedTransactions).sort((a, b) => {
    const dateA = parse(`01 ${a}`, 'dd MMMM yyyy', new Date());
    const dateB = parse(`01 ${b}`, 'dd MMMM yyyy', new Date());
    return dateB - dateA;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <Card className="glass-effect shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl gradient-text">
            <FileText className="mr-2 h-6 w-6" />
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date" className="text-gray-300">Date (DD/MM/YYYY)</Label>
                <Input id="date" {...register('date')} placeholder="e.g., 25/12/2024" className="bg-slate-700 border-gray-600 text-white" />
                {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>}
              </div>
              <div>
                <Label htmlFor="description" className="text-gray-300">Description</Label>
                <Input id="description" {...register('description')} placeholder="e.g., Office Supplies" className="bg-slate-700 border-gray-600 text-white" />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
              </div>
              <div>
                <Label htmlFor="amount" className="text-gray-300">Amount</Label>
                <Input id="amount" type="text" {...register('amount')} placeholder="e.g., 150.75" className="bg-slate-700 border-gray-600 text-white" />
                {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>}
              </div>
              <div>
                <Label htmlFor="type" className="text-gray-300">Type</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-slate-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-gray-700 text-white">
                        <SelectItem value="credit" className="hover:bg-slate-700">Credit</SelectItem>
                        <SelectItem value="debit" className="hover:bg-slate-700">Debit</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type.message}</p>}
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              {editingTransaction && (
                <Button type="button" variant="outline" onClick={() => { reset(); setEditingTransaction(null); }} className="border-gray-500 text-gray-300 hover:bg-gray-700">
                  Cancel Edit
                </Button>
              )}
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white glow">
                <PlusCircle className="mr-2 h-5 w-5" />
                {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {sortedMonthYears.map(monthYear => (
        <Card key={monthYear} className="glass-effect shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl gradient-text">{monthYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b-gray-700">
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Description</TableHead>
                  <TableHead className="text-right text-gray-300">Amount</TableHead>
                  <TableHead className="text-center text-gray-300">Type</TableHead>
                  <TableHead className="text-right text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedTransactions[monthYear].transactions
                  .sort((a,b) => parse(b.date, 'dd/MM/yyyy', new Date()) - parse(a.date, 'dd/MM/yyyy', new Date()))
                  .map(transaction => (
                  <TableRow key={transaction.id} className="border-b-gray-800 hover:bg-slate-800/50">
                    <TableCell className="text-gray-400">{transaction.date}</TableCell>
                    <TableCell className="text-gray-200">{transaction.description}</TableCell>
                    <TableCell className={`text-right font-medium ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                      R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-center">
                      {transaction.type === 'credit' ? (
                        <span className="px-2 py-1 text-xs font-semibold text-green-300 bg-green-700/30 rounded-full flex items-center justify-center">
                          <TrendingUp className="mr-1 h-4 w-4" /> Credit
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold text-red-300 bg-red-700/30 rounded-full flex items-center justify-center">
                          <TrendingDown className="mr-1 h-4 w-4" /> Debit
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(transaction)} className="text-blue-400 hover:text-blue-300 mr-2 p-1">
                        <Edit size={18} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(transaction.id)} className="text-red-400 hover:text-red-300 p-1">
                        <Trash2 size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between items-center pt-4 border-t border-gray-700">
            <div className="text-green-400 font-semibold">
              Total Credit: R$ {groupedTransactions[monthYear].totalCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-red-400 font-semibold">
              Total Debit: R$ {groupedTransactions[monthYear].totalDebit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardFooter>
        </Card>
      ))}
      {transactions.length === 0 && (
         <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
          <FileText size={64} className="mx-auto text-gray-500 mb-4" />
          <p className="text-xl text-gray-400">No transactions yet.</p>
          <p className="text-gray-500">Start by adding a new transaction above.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AccountingDashboard;
