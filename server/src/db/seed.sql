INSERT INTO categories (name, type) VALUES
  ('Salary',        'income'),
  ('Freelance',     'income'),
  ('Investment',    'income'),
  ('Bonus',         'income'),
  ('Gift',          'income'),
  ('Food',          'expense'),
  ('Transport',     'expense'),
  ('Utilities',     'expense'),
  ('Entertainment', 'expense'),
  ('Shopping',      'expense'),
  ('Healthcare',    'expense'),
  ('Education',     'expense'),
  ('Housing',       'expense'),
  ('Insurance',     'expense'),
  ('Savings',       'expense')
ON CONFLICT DO NOTHING;