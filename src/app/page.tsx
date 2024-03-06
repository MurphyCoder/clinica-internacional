import Image from 'next/image';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='flex flex-col items-center'>
        <Image
          src='/assets/logo.png'
          alt='Clinica Internacional'
          width={400}
          height={200}
        />
        <h1 className='text-4xl font-bold mt-8'>
          ¡Bienvenido a Clinica Internacional!
        </h1>
        <p className='text-lg mt-4'>
          Prueba de Frontend para Clinica Internacional
        </p>
      </div>

      {/* inicio de sesion */}

      <div className='flex flex-col items-center'>
        <h2 className='text-2xl font-bold mt-2'>Iniciar Sesión</h2>
        <form className='flex flex-col mt-4'>
          <input
            type='text'
            placeholder='Correo Electrónico'
            className='p-2 border border-gray-300 rounded-lg mb-4'
          />
          <input
            type='password'
            placeholder='Contraseña'
            className='p-2 border border-gray-300 rounded-lg mb-4'
          />
          <button
            type='submit'
            className='bg-blue-500 text-white p-2 rounded-lg'
          >
            Iniciar Sesión
          </button>
        </form>
      </div>

      <footer className='text-center text-gray-400 text-sm'>
        <p>
          <a
            href=' https://www.linkedin.com/in/eduardo-alejandro-ramirez-ramirez-2b9a3b1a6/' // 👈 Update this link
            target='_blank'
            rel='noopener noreferrer'
            className='underline'
          >
            Brayan Murphy Crespo Espinoza
          </a>{' '}
          &copy; 2024
        </p>
      </footer>
    </main>
  );
}
