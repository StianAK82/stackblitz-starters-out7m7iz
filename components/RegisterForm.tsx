import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const registerSchema = z.object({
  email: z.string().email('Ugyldig e-postadresse'),
  password: z.string().min(6, 'Passordet må være minst 6 tegn'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passordene må være like",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signUpError) {
        throw signUpError;
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError('Det oppstod en feil under registrering');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          E-post
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="mt-1 input"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Passord
        </label>
        <input
          type="password"
          id="password"
          {...register('password')}
          className="mt-1 input"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Bekreft passord
        </label>
        <input
          type="password"
          id="confirmPassword"
          {...register('confirmPassword')}
          className="mt-1 input"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary"
        >
          {isSubmitting ? 'Registrerer...' : 'Registrer'}
        </button>
      </div>

      <div className="text-center text-sm">
        <Link href="/auth/login" className="text-blue-600 hover:text-blue-800">
          Har du allerede en konto? Logg inn her
        </Link>
      </div>
    </form>
  );
}