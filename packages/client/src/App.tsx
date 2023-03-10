import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '../trpc';

import './index.scss';
import { httpBatchLink } from '@trpc/client';

const client = new QueryClient();

const AppContent = () => {
  const getMessages = trpc.getMessages.useQuery();
  const addMessage = trpc.addMessage.useMutation();
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');

  const onAddMessage = () => {
    addMessage.mutate(
      {
        user,
        message,
      },
      {
        onSuccess: () => {
          client.invalidateQueries();
        },
      }
    );
  };

  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      <div>
        {(getMessages.data ?? []).map((row) => (
          <div key={row.message}>{JSON.stringify(row)}</div>
        ))}
      </div>
      <div className="mt-10">
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="p-5 border-2 border-gray-600 rounde-dlg w-full"
          placeholder="User"
        />

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-5 border-2 border-gray-600 rounde-dlg w-full"
          placeholder="Message"
        />
        <button onClick={onAddMessage}>Add message</button>
      </div>
    </div>
  );
};

const App = () => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:8080/trpc',
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
ReactDOM.render(<App />, document.getElementById('app'));
