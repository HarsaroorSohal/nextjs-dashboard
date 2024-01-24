import { sql, db } from '@vercel/postgres';
import { Suspense } from 'react';

const tempComponent = () => {
  return <> Hello world </>;
};

const sleep1 = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
export default async function Page() {
  // console.log(sleep, sleep1);
  // await sleep1(2000);
  const Customers = await sql`SELECT * from customers`;

  return (
    <Suspense fallback="Loading...">
      <>
        {Customers.rows.map((customer) => {
          return <div key={customer.customerID}> {customer.name} </div>;
        })}
      </>
    </Suspense>
  );
}
