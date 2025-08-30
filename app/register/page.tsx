// app/register/page.tsx

'use client';

import { IMaskInput } from 'react-imask'; // 👈 Importe o hook

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [isLengthValid, setIsLengthValid] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const validatePassword = (pwd: string) => {
    setHasUpperCase(/[A-Z]/.test(pwd));
    setHasLowerCase(/[a-z]/.test(pwd));
    setHasNumber(/[0-9]/.test(pwd));
    setHasSpecialChar(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd));
    setIsLengthValid(pwd.length >= 8); // Ajuste o comprimento mínimo se desejar
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro no registro.');
      }

      router.push(`/verify-email?email=${encodeURIComponent(email)}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Crie sua Conta</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          {/* Campo de Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          {/* Campo de Telefone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <IMaskInput
              mask="(00) 00000-0000"
              id="phone"
              name="phone"
              value={phone}
              onAccept={(value, mask) => setPhone(value)}
              type="tel"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* Campo de Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                required
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <span className="text-xl">
                  {showPassword ? '👁️' : '🔒'}
                </span>
              </button>
            </div>
            <ul className="text-sm mt-2 space-y-1">
              <li className={isLengthValid ? 'text-green-500' : 'text-gray-500'}>
                <span className="mr-1">{isLengthValid ? '✔' : '✖'}</span> Mínimo de 8 caracteres
              </li>
              <li className={hasUpperCase ? 'text-green-500' : 'text-gray-500'}>
                <span className="mr-1">{hasUpperCase ? '✔' : '✖'}</span> Letra maiúscula
              </li>
              <li className={hasLowerCase ? 'text-green-500' : 'text-gray-500'}>
                <span className="mr-1">{hasLowerCase ? '✔' : '✖'}</span> Letra minúscula
              </li>
              <li className={hasNumber ? 'text-green-500' : 'text-gray-500'}>
                <span className="mr-1">{hasNumber ? '✔' : '✖'}</span> Número
              </li>
              <li className={hasSpecialChar ? 'text-green-500' : 'text-gray-500'}>
                <span className="mr-1">{hasSpecialChar ? '✔' : '✖'}</span> Caractere especial
              </li>
            </ul>
          </div>

          {/* Campo de Confirmação de Senha */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirme a Senha
            </label>
            <div className="relative mt-1">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <span className="text-xl">
                  {showConfirmPassword ? '👁️' : '🔒'}
                </span>
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" disabled={loading} className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}