import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import { useAppState, useActions } from '../../overmind';

const TAX = 0.0875;

function Home() {
  const state = useAppState() as any;
  const actions = useActions() as any;
  const [tip, setTip] = useState<number>(0.15);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      dollarAmount: ''
    },

    validate: {
      dollarAmount: (value) => (/^\d+$/.test(value) ? null : 'Only digits are allowed')
    }
  });

  const numValue = Number(form.values.dollarAmount);

  return (
    <div className="space-y-5 p-5">
      <div className="text-blue-500 text-2xl font-bold">Tip + Tax Calculator</div>
      <form
        onSubmit={form.onSubmit((values) => actions.setSubmitted(true))}
        className="flex flex-col gap-2 justify-center items-start">
        <input
          placeholder="Enter Dollar Amount"
          data-cy="test-input"
          {...form.getInputProps('dollarAmount')}
          className="border border-gray-300"
        />

        <div className="flex items-center space-x-2">
          <input type="radio" checked={tip === 0.15} value={0.15} onChange={() => setTip(0.15)} />
          <div>Tip (15%): $ {(numValue * 0.15).toFixed(2)}</div>
        </div>
        <div className="flex items-center space-x-2">
          <input type="radio" checked={tip === 0.2} value={0.2} onChange={() => setTip(0.2)} />
          <div>Tip (20%): $ {(numValue * 0.2).toFixed(2)}</div>
        </div>
        <input className="bg-blue-500 rounded-lg p-2 text-white" type="submit" value="Submit" />
        <div className="text-red-400">
          {Object.values(form.errors).map((error, index) => (
            <span key={index}>{error}</span>
          ))}
        </div>
      </form>
      {state.submitted && (
        <>
          <div>Tax: $ {(numValue * TAX).toFixed(2)}</div>
          <div>Total: $ {(numValue + numValue * TAX + numValue * tip).toFixed(2)}</div>
        </>
      )}
      <button onClick={() => router.push('/restaurants')} className="rounded-lg text-purple-400">
        Go to Restaurants
      </button>
    </div>
  );
}

export default Home;
