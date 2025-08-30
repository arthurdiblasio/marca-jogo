// app/team/create/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Para checar a sessão do usuário
import Link from 'next/link';

export default function CreateTeamPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [sport, setSport] = useState('');
  const [foundedAt, setFoundedAt] = useState('');
  const [history, setHistory] = useState('');
  const [hasField, setHasField] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [fieldAddress, setFieldAddress] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Redirecionar se o usuário não estiver logado
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/team/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          sport,
          foundedAt,
          history,
          hasField,
          fieldName,
          fieldAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar o time.');
      }

      setSuccess('Time criado com sucesso!');
      // Redireciona para o painel ou para a página do time
      router.push('/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Criar Novo Time</h2>
        <p className="text-center text-gray-600 mb-8">
          Preencha as informações do seu time.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome do Time */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome do Time
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Esporte */}
          <div>
            <label htmlFor="sport" className="block text-sm font-medium text-gray-700">
              Esporte
            </label>
            <input
              id="sport"
              type="text"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Ano de Fundação */}
          <div>
            <label htmlFor="foundedAt" className="block text-sm font-medium text-gray-700">
              Ano de Fundação
            </label>
            <input
              id="foundedAt"
              type="number"
              value={foundedAt}
              onChange={(e) => setFoundedAt(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* História do Time */}
          <div>
            <label htmlFor="history" className="block text-sm font-medium text-gray-700">
              História (Opcional)
            </label>
            <textarea
              id="history"
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              rows={4}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Tem Campo Próprio? */}
          <div className="flex items-center">
            <input
              id="hasField"
              type="checkbox"
              checked={hasField}
              onChange={(e) => setHasField(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="hasField" className="ml-2 block text-sm font-medium text-gray-700">
              O time tem campo próprio?
            </label>
          </div>

          {/* Campos do Campo (Exibidos condicionalmente) */}
          {hasField && (
            <>
              <div>
                <label htmlFor="fieldName" className="block text-sm font-medium text-gray-700">
                  Nome do Campo
                </label>
                <input
                  id="fieldName"
                  type="text"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  required={hasField}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="fieldAddress" className="block text-sm font-medium text-gray-700">
                  Endereço do Campo
                </label>
                <input
                  id="fieldAddress"
                  type="text"
                  value={fieldAddress}
                  onChange={(e) => setFieldAddress(e.target.value)}
                  required={hasField}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
          >
            {loading ? 'Criando...' : 'Criar Time'}
          </button>
        </form>
      </div>
    </div>
  );
}