'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { 
  upsertCustomer, 
  getCustomers, 
  updateCustomer, 
  deleteCustomer
} from '@/lib/database'
import { type Customer } from '@/lib/types'

export async function refreshCustomersPage() {
  revalidatePath('/dashboard/customers')
  redirect('/dashboard/customers')
}

export async function createCustomer(formData: FormData): Promise<{ success: boolean; message: string }> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string

  if (!name || !email) {
    throw new Error('Name and email are required')
  }

  try {
    const customer = await upsertCustomer({
      name,
      email,
      phone: phone || undefined
    })
    console.log('[SERVER ACTION] Customer created in Supabase:', customer)
    revalidatePath('/dashboard/customers')
    return { success: true, message: 'Customer created successfully' }
  } catch (error) {
    console.error('Error creating customer:', error)
    throw new Error('Failed to create customer')
  }
}

export async function updateCustomerAction(formData: FormData): Promise<{ success: boolean; message: string }> {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string

  if (!id || !name || !email) {
    throw new Error('ID, name and email are required')
  }

  try {
    const updatedCustomer = await updateCustomer(id, {
      name,
      email,
      phone: phone || undefined
    })
    console.log('[SERVER ACTION] Customer updated in Supabase:', updatedCustomer)
    revalidatePath('/dashboard/customers')
    return { success: true, message: 'Customer updated successfully' }
  } catch (error) {
    console.error('Error updating customer:', error)
    throw new Error('Failed to update customer')
  }
}

export async function updateCustomerById(id: string, customerData: Partial<Customer>): Promise<Customer> {
  if (!id) {
    throw new Error('Customer ID is required')
  }

  try {
    const updatedCustomer = await updateCustomer(id, customerData)
    console.log('[SERVER ACTION] Customer updated in Supabase:', updatedCustomer)
    revalidatePath('/dashboard/customers')
    return updatedCustomer
  } catch (error) {
    console.error('Error updating customer:', error)
    throw new Error('Failed to update customer')
  }
}

export async function deleteCustomerAction(formData: FormData): Promise<{ success: boolean; message: string }> {
  const id = formData.get('id') as string

  if (!id) {
    throw new Error('Customer ID is required')
  }

  try {
    await deleteCustomer(id)
    console.log('[SERVER ACTION] Customer deleted from Supabase:', id)
    revalidatePath('/dashboard/customers')
    return { success: true, message: 'Customer deleted successfully' }
  } catch (error) {
    console.error('Error deleting customer:', error)
    throw new Error('Failed to delete customer')
  }
}

export async function deleteCustomerById(id: string): Promise<void> {
  if (!id) {
    throw new Error('Customer ID is required')
  }

  try {
    await deleteCustomer(id)
    console.log('[SERVER ACTION] Customer deleted from Supabase:', id)
    revalidatePath('/dashboard/customers')
  } catch (error) {
    console.error('Error deleting customer:', error)
    throw new Error('Failed to delete customer')
  }
}

export async function getAllCustomers(): Promise<Customer[]> {
  try {
    const customers = await getCustomers()
    console.log('[SERVER ACTION] Customers fetched from Supabase:', customers)
    return customers
  } catch (error) {
    console.error('Error fetching customers:', error)
    throw new Error('Failed to fetch customers')
  }
} 