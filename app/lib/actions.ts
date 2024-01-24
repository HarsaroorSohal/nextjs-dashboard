'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const handleFormSubmit = async (formData: FormData) => {
  const rawFormData = {
    customerId: formData.get('customerId')?.toString(),
    amount: Number(formData.get('amount')),
    status: formData.get('status')?.toString(),
  };
  const amountInCents = rawFormData.amount * 100;
  const date = new Date().toISOString().split('T')[0];
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${rawFormData.customerId}, ${amountInCents}, ${rawFormData.status}, ${date})
  `;
  } catch (e) {
    console.log('Error which submitting form');
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
};

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (e) {
    console.log('Error which deleting invoice');
  }
  revalidatePath('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  const rawData = {
    customerId: formData.get('customerId')?.toString(),
    amount: Number(formData.get('amount')),
    status: formData.get('status')?.toString(),
  };

  const amountInCents = rawData.amount * 100;
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${rawData.customerId}, amount = ${amountInCents}, status = ${rawData.status}
      WHERE id = ${id}
    `;
  } catch (e) {
    console.log('Error which updating invoice');
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
