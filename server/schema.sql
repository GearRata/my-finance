-- 1. สร้างตาราง Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. สร้างตาราง Categories (หมวดหมู่ น่าจะเป็นข้อมูลกลาง)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- เช่น 'income' หรือ 'expense'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. สร้างตาราง Accounts (บัญชีรับจ่าย/กระเป๋าเงิน)
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    balance NUMERIC(15, 2) DEFAULT 0.00,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. สร้างตาราง Transactions (รายการธุรกรรม)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    amount NUMERIC(15, 2) NOT NULL,
    note TEXT,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id INT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. สร้างตาราง Goals (เป้าหมายการออมเงิน)
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    target_amount NUMERIC(15, 2) NOT NULL,
    current_amount NUMERIC(15, 2) DEFAULT 0.00,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. สร้างตาราง Images (รูปภาพประกอบสำหรับ Goals)
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    asset_id VARCHAR(255),
    public_id VARCHAR(255),
    url VARCHAR(500) NOT NULL,
    secure_url VARCHAR(500),
    goal_id INT REFERENCES goals(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. สร้างตาราง Budgets (งบประมาณหลัก/รายเดือน)
CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    month VARCHAR(20) NOT NULL, -- เช่น '2023-10'
    status VARCHAR(50) DEFAULT 'draft', -- เช่น 'draft', 'confirmed'
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. สร้างตาราง Budget_item (รายการในงบประมาณย่อยแต่ละหมวด)
CREATE TABLE budget_item (
    id SERIAL PRIMARY KEY,
    budget_id INT NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
