# EL GIBBOR Import & Export - Company Management System

A modern, responsive company website and staff portal for **EL GIBBOR Import & Export** built using React, TypeScript, Tailwind CSS, Vite, and Supabase.

This repository separates the public marketing website from an internal Staff Management System featuring role-based dashboards, secure authentication with email verification (links/OTP), employee reporting pipelines, product inventory management, and media uploads.

---

## Features

### 🌐 Public Website
- **Home, About Us, Services, Products, Gallery, Careers, Contact**: Fully responsive modern public pages.
- **Dynamic Content**: Displays featured products and new arrivals directly from the database.
- **Visitor Communication**: Public contact form that feeds messages directly into the Manager Dashboard.
- **Hidden Entrance**: Access the internal staff portal via the discreet "Staff" link in the navigation menu.

### 🔑 Staff Portal & Authentication
- **Secure Authentication**: Power by Supabase Auth with automated verification emails.
- **Multi-Method Verification**: Supports both Magic email link confirmations and 6-digit OTP verification codes.
- **Role-Based Access Control (RBAC)**: Secure redirection for **Managers** and **Employees** using React Router protected routes.
- **Suspension Protection**: Suspended employees are immediately locked out of the dashboards.

### 📊 Manager (Admin) Dashboard
- **Overview Stats**: Monitor total employees, total products, and work reports.
- **HR Controls**: Register new employees and instantly toggle employee account status (Active / Suspended).
- **Product Inventory (CRUD)**: Create, edit, list, and delete products, featuring categories, prices, and media uploading.
- **Approval System**: View employee task logs and approve submitted work reports.
- **News Broadcasting**: Publish announcements and new arrivals straight to the employee dashboard and public Home page.

### 📝 Employee Workspace
- **My Tasks**: View tasks assigned by the manager and toggle status (Pending ➡️ In Progress ➡️ Completed).
- **Submit Report**: Report title, detailed description, starting/finished time, priority, and department logging.
- **Report Logs**: View approval history of submitted reports.
- **Account Settings**: Update full name, phone number, and change passwords securely.

---

## Setup & Configuration

Follow these steps to configure your Supabase backend and run the application locally:

### 1. Database Configuration
1. Go to the [Supabase Console](https://supabase.com) and spin up a new project.
2. Open the **SQL Editor** in your Supabase dashboard.
3. Open the [supabase_schema.sql](file:///d:/el-gibbor-trading-website/supabase_schema.sql) file from this project root, copy the contents, paste them into the SQL Editor, and click **Run**.
4. This creates all necessary tables, trigger functions for profile generation, and Row-Level Security (RLS) policies.

### 2. Configure Email Authentication
1. Go to **Authentication** ➡️ **Providers** ➡️ **Email** in the Supabase dashboard.
2. Ensure **Confirm Email** is enabled.
3. Customize your registration templates to show the OTP code by inserting `{{ .Token }}`.
4. Set up your authentication redirect URLs in **Authentication** ➡️ **URL Configuration**:
   - Site URL: `http://localhost:5173` (or your production website domain)
   - Redirect Wildcards: `http://localhost:5173/staff*`

### 3. Create Storage Buckets
1. Navigate to **Storage** in the Supabase dashboard.
2. Create a new bucket named `products-media`.
3. Set the bucket privacy toggle to **Public** so that product images and videos are readable on the public website.
4. Add a storage policy to allow **Authenticated Users** (Managers) to `Insert`, `Update`, and `Delete` files.

### 4. Create your Local Environment File
Create a file named `.env` in the root of the project:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anonymous-public-key
```

### 5. Designating the Manager (Admin) Account
Because registration via the Staff Portal defaults to the `employee` role:
1. Register your admin email through the portal's "Register" page, or invite the email from your Supabase Auth dashboard.
2. Verify the email.
3. Go to the **Table Editor** on your Supabase dashboard, select the `profiles` table, locate your account row, and change the `role` value from `employee` to `manager`.

---

## How to Run Locally

To spin up the local development server:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```

3. **Open the Application**:
   Open [http://localhost:5173](http://localhost:5173) in your web browser. To access the internal system, click the **Staff** link in the navigation menu.

---

## Build for Production
To generate a compiled production build:
```bash
npm run build
```
The optimized bundle will be created in the `dist/` directory, ready to be hosted on Netlify, Vercel, or your hosting server.
