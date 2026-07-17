-- Alter profiles table to add salary
alter table public.profiles 
add column if not exists salary numeric default 0;

-- Alter categories table to add image_url
alter table public.categories 
add column if not exists image_url text;

-- Alter announcements table to add type and status
alter table public.announcements 
add column if not exists type text check (type in ('news', 'event', 'meeting', 'alert')) default 'news',
add column if not exists status text check (status in ('active', 'canceled', 'completed')) default 'active';

-- Create Notifications Table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text check (type in ('report', 'task', 'announcement', 'message')) not null,
  link text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS for notifications
alter table public.notifications enable row level security;

-- Add policies for notifications
create policy "Users can read their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Managers can manage all notifications"
  on public.notifications for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'manager'
    )
  );

-- Trigger to notify managers when a new contact message is submitted
create or replace function public.notify_manager_on_message()
returns trigger as $$
declare
  manager_record record;
begin
  for manager_record in select id from public.profiles where role = 'manager' loop
    insert into public.notifications (user_id, title, message, type, link)
    values (
      manager_record.id,
      'New Customer Message',
      'Visitor ' || new.name || ' sent a message: "' || substring(new.message from 1 for 40) || '..."',
      'message',
      'messages'
    );
  end loop;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_contact_message_created
  after insert on public.contact_messages
  for each row execute procedure public.notify_manager_on_message();

-- Trigger to notify employees when a new task is assigned
create or replace function public.notify_employee_on_task()
returns trigger as $$
begin
  insert into public.notifications (user_id, title, message, type, link)
  values (
    new.assigned_to,
    'New Task Assigned',
    'Manager assigned task: "' || new.title || '"',
    'task',
    'tasks'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_task_created
  after insert on public.tasks
  for each row execute procedure public.notify_employee_on_task();

-- Trigger to notify managers when an employee submits a report
create or replace function public.notify_manager_on_report()
returns trigger as $$
declare
  manager_record record;
  employee_name text;
begin
  select full_name into employee_name from public.profiles where id = new.employee_id;
  for manager_record in select id from public.profiles where role = 'manager' loop
    insert into public.notifications (user_id, title, message, type, link)
    values (
      manager_record.id,
      'New Report Submitted',
      employee_name || ' submitted report: "' || new.title || '"',
      'report',
      'reports'
    );
  end loop;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_report_created
  after insert on public.reports
  for each row execute procedure public.notify_manager_on_report();
