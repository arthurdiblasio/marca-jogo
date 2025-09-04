// app/team/create/page.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Para checar a sessão do usuário
import Link from 'next/link';

export default function CreateTeamPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [availableSports, setAvailableSports] = useState([]); // Estado para a lista de esportes
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [sportId, setSportId] = useState('');
  const [name, setName] = useState('');
  const [foundedAt, setFoundedAt] = useState('');
  const [history, setHistory] = useState('');
  const [hasField, setHasField] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [fieldAddress, setFieldAddress] = useState('');
  const [logo, setLogo] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null); // 👈 Novo estado para o arquivo
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null); // 👈 Novo estado

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');


  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    const yearsList = [];
    for (let year = currentYear; year >= startYear; year--) {
      yearsList.push(year);
    }
    return yearsList;
  }, [])

  // app/team/create/page.tsx

  const fetchSuggestions = async (input) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`/api/google-places?input=${encodeURIComponent(input)}`);
      const data = await response.json();
      if (response.ok) {
        setSuggestions(data.predictions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
    }
  };

  useEffect(() => {
    async function fetchSports() {
      try {
        const response = await fetch('/api/sports');
        const data = await response.json();
        if (response.ok) {
          setAvailableSports(data.sports);
        }
      } catch (error) {
        console.error('Falha ao carregar esportes:', error);
      }
    }
    fetchSports();
  }, []);

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const handleFileUpload = async () => {
    if (!logoFile) {
      return null;
    }
    const formData = new FormData();
    formData.append('logo', logoFile);

    try {
      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro no upload da logo.');
      }
      return data.url;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const logoUrl = await handleFileUpload(); // 🚀 Primeiro, faz o upload

    if (logoFile && !logoUrl) {
      // Se o upload falhou, pare a submissão
      setLoading(false);
      return;
    }


    try {
      const response = await fetch('/api/team/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          sportId,
          abbreviation,
          logo: logoUrl,
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
          <div>
            <label htmlFor="abbreviation" className="block text-sm font-medium text-gray-700">
              Abreviatura (Máx. 20 caracteres)
            </label>
            <input
              id="abbreviation"
              type="text"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
              maxLength={20}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            {/* Esporte */}
            <label htmlFor="sportId" className="block text-sm font-medium text-gray-700">
              Esporte
            </label>
            <select
              id="sportId"
              value={sportId}
              onChange={(e) => setSportId(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um esporte</option>
              {availableSports.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
              Logo do Time (Opcional)
            </label>
            <input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setLogoFile(file);

                  // 🚀 NOVO: Cria uma URL temporária para pré-visualização
                  const objectUrl = URL.createObjectURL(file);
                  setLogoPreviewUrl(objectUrl);
                } else {
                  setLogoFile(null);
                  setLogoPreviewUrl(null); // Limpa a pré-visualização se nenhum arquivo for selecionado
                }
              }}
              className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
            />
          </div>
          {logoPreviewUrl && (
            <div className="mt-4 flex justify-center">
              <img src={logoPreviewUrl} alt="Pré-visualização da Logo" className="h-32 w-32 object-contain rounded-md border border-gray-300" />
            </div>
          )}

          {/* Ano de Fundação */}
          <div>
            <label htmlFor="foundedAt" className="block text-sm font-medium text-gray-700">
              Ano de Fundação
            </label>
            <select
              id="foundedAt"
              value={foundedAt}
              onChange={(e) => setFoundedAt(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um ano</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
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
                {/* <input
                  id="fieldAddress"
                  type="text"
                  value={fieldAddress}
                  onChange={(e) => setFieldAddress(e.target.value)}
                  required={hasField}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                /> */}
                {fieldAddress}
                <input
                  id="fieldAddress"
                  type="text"
                  value={fieldAddress}
                  onChange={(e) => {
                    setFieldAddress(e.target.value);
                    fetchSuggestions(e.target.value);
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onFocus={() => setShowSuggestions(true)}
                  required={hasField}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                    {suggestions.map((s) => (
                      <li
                        key={s.place_id}
                        onClick={() => {
                          setFieldAddress(s.description); // 👈 Garante que o estado seja atualizado
                          setSuggestions([]);
                          setShowSuggestions(false);
                        }}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {s.description}
                      </li>
                    ))}
                  </ul>
                )}
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
      </div >
    </div >
  );
}