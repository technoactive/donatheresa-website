-- Enable the UUID extension
create extension if not exists "uuid-ossp" with schema "extensions";

-- Create the bookings table
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  party_size integer not null,
  booking_time timestamp with time zone not null,
  status text not null default 'pending', -- pending, confirmed, cancelled
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Function to update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update the updated_at timestamp
create trigger on_booking_update
  before update on public.bookings
  for each row execute procedure public.handle_updated_at();
