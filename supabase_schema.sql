-- Create Departments Table
create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  code text unique not null,
  description text,
  created_at timestamptz default now()
);

-- Create Profiles Table (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role text not null check (role in ('manager', 'employee')) default 'employee',
  department_id uuid references public.departments(id) on delete set null,
  position text,
  status text not null check (status in ('active', 'suspended')) default 'active',
  date_joined date default current_date,
  created_at timestamptz default now()
);

-- Create Categories Table
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  description text,
  created_at timestamptz default now()
);

-- Create Products Table
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_id uuid references public.categories(id) on delete set null,
  description text,
  price numeric,
  status text not null check (status in ('draft', 'published')) default 'published',
  is_featured boolean default false,
  is_new_arrival boolean default false,
  created_at timestamptz default now()
);

-- Create Product Images Table
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  url text not null,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- Create Product Videos Table
create table public.product_videos (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  url text not null,
  created_at timestamptz default now()
);

-- Create Tasks Table
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  assigned_to uuid references public.profiles(id) on delete cascade,
  status text not null check (status in ('pending', 'in_progress', 'completed')) default 'pending',
  priority text not null check (priority in ('low', 'medium', 'high')) default 'medium',
  due_date date,
  created_at timestamptz default now()
);

-- Create Reports Table
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  date date default current_date,
  time_started time not null,
  time_finished time not null,
  department_id uuid references public.departments(id) on delete set null,
  priority text not null check (priority in ('low', 'medium', 'high')) default 'medium',
  status text not null check (status in ('pending', 'approved', 'completed')) default 'pending',
  created_at timestamptz default now()
);

-- Create Announcements Table
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  publish_date date default current_date,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- Create Contact Messages Table
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Trigger for Profile Creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, role, position, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'role', 'employee'),
    coalesce(new.raw_user_meta_data->>'position', 'Staff'),
    'active'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Security definer helper to check if current user is manager (prevents recursion)
create or replace function public.is_manager()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'manager'
  );
end;
$$ language plpgsql security definer;

-- Enable Row Level Security (RLS)
alter table public.departments enable row level security;
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_videos enable row level security;
alter table public.tasks enable row level security;
alter table public.reports enable row level security;
alter table public.announcements enable row level security;
alter table public.contact_messages enable row level security;

-- Define RLS Policies

-- Profiles Policies
create policy "Allow public read-access to profiles"
  on public.profiles for select
  using (true);

create policy "Allow employees to edit their own profiles"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Allow managers to manage all profiles"
  on public.profiles for all
  using (
    public.is_manager()
  );

-- Departments Policies
create policy "Allow anyone to view departments"
  on public.departments for select
  using (true);

create policy "Allow managers to manage departments"
  on public.departments for all
  using (
    public.is_manager()
  );

-- Products & Categories Policies
create policy "Allow anyone to view categories"
  on public.categories for select
  using (true);

create policy "Allow managers to manage categories"
  on public.categories for all
  using (
    public.is_manager()
  );

create policy "Allow anyone to view products"
  on public.products for select
  using (true);

create policy "Allow managers to manage products"
  on public.products for all
  using (
    public.is_manager()
  );

-- Product Media Policies
create policy "Allow anyone to view product images"
  on public.product_images for select
  using (true);

create policy "Allow managers to manage product images"
  on public.product_images for all
  using (
    public.is_manager()
  );

create policy "Allow anyone to view product videos"
  on public.product_videos for select
  using (true);

create policy "Allow managers to manage product videos"
  on public.product_videos for all
  using (
    public.is_manager()
  );

-- Tasks Policies
create policy "Employees can view their own tasks"
  on public.tasks for select
  using (auth.uid() = assigned_to);

create policy "Managers can manage all tasks"
  on public.tasks for all
  using (
    public.is_manager()
  );

-- Reports Policies
create policy "Employees can view their own reports"
  on public.reports for select
  using (auth.uid() = employee_id);

create policy "Employees can submit reports"
  on public.reports for insert
  with check (auth.uid() = employee_id);

create policy "Employees can update their own reports"
  on public.reports for update
  using (auth.uid() = employee_id);

create policy "Managers can manage all reports"
  on public.reports for all
  using (
    public.is_manager()
  );

-- Announcements Policies
create policy "Anyone can view announcements"
  on public.announcements for select
  using (true);

create policy "Managers can manage announcements"
  on public.announcements for all
  using (
    public.is_manager()
  );

-- Contact Messages Policies
create policy "Allow anyone to submit contact messages"
  on public.contact_messages for insert
  with check (true);

create policy "Managers can manage contact messages"
  on public.contact_messages for all
  using (
    public.is_manager()
  );
