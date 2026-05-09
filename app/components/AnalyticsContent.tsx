'use client';

import { useFinance } from '../context/FinanceContext';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

interface ChartDataItem {
  name: string;
  value: number;
  amount: number;
}

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

export default function AnalyticsContent() {
  const { transactions, getTotalIncome, getTotalExpense, wallets } = useFinance();
  
  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();
  const netFlow = totalIncome - totalExpense;

  // Category breakdown for expenses
  const expensesByCategory: { [key: string]: number } = {};
  transactions.forEach(t => {
    if (t.type === 'expense') {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
    }
  });

  const expenseCategoryData: CategoryData[] = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / totalExpense) * 100,
  }));

  // Income breakdown
  const incomeByCategory: { [key: string]: number } = {};
  transactions.forEach(t => {
    if (t.type === 'income') {
      incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
    }
  });

  const incomeCategoryData: CategoryData[] = Object.entries(incomeByCategory).map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / totalIncome) * 100,
  }));

  // Wallet distribution
  const walletDistribution = wallets.map(w => ({
    name: w.name,
    value: w.balance,
  }));

  // Time series data (simulated)
  const timeSeriesData = [
    { date: 'Week 1', income: 500000, expense: 350000 },
    { date: 'Week 2', income: 600000, expense: 420000 },
    { date: 'Week 3', income: 550000, expense: 380000 },
    { date: 'Week 4', income: 700000, expense: 450000 },
  ];

  const COLORS = [
    'oklch(0.52 0.194 258.8)',  // primary blue
    'oklch(0.52 0.17 142.5)',   // secondary green
    'oklch(0.646 0.222 41.116)', // chart-1 orange
    'oklch(0.6 0.118 184.704)',  // chart-2 cyan
    'oklch(0.577 0.245 27.325)', // chart-5 red
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur-md">
        <div className="flex items-center gap-4 px-4 py-4">
          <Link href="/" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground">Analytics</h1>
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Income</p>
              <TrendingUp size={16} className="text-secondary" />
            </div>
            <p className="text-lg font-bold text-secondary">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Expense</p>
              <TrendingDown size={16} className="text-destructive" />
            </div>
            <p className="text-lg font-bold text-destructive">{formatCurrency(totalExpense)}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Net</p>
            </div>
            <p className={`text-lg font-bold ${netFlow >= 0 ? 'text-secondary' : 'text-destructive'}`}>
              {formatCurrency(netFlow)}
            </p>
          </div>
        </div>

        {/* Income vs Expense Chart */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
                formatter={(value: any) => formatCurrency(value)}
              />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="var(--chart-2)" strokeWidth={2} dot={{ fill: 'var(--chart-2)' }} />
              <Line type="monotone" dataKey="expense" stroke="var(--chart-1)" strokeWidth={2} dot={{ fill: 'var(--chart-1)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown */}
        {expenseCategoryData.length > 0 && (
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expenseCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category}: ${percentage.toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {expenseCategoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {expenseCategoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-foreground">{item.category}</span>
                  </div>
                  <span className="font-medium text-foreground">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Income Breakdown */}
        {incomeCategoryData.length > 0 && (
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">Income Sources</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={incomeCategoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="category" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Bar dataKey="amount" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Wallet Distribution */}
        {walletDistribution.length > 0 && (
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">Wallet Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={walletDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {walletDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
