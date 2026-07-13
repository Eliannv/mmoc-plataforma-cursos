import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import logoMMO from '../../../src/assets/logos/LogosMMO.png'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, BookOpen } from 'lucide-react'
import { useLogin, useRegistro } from '../../application/hooks/useAuth'


interface ApiError {
  response?: { data?: { error?: { message?: string } } }
}

type Tab = 'login' | 'registro'

const loginSchema = z.object({
  correo: z.string().email('Correo inválido'),
  contrasena: z.string().min(8, 'Mínimo 8 caracteres'),
})

const registroSchema = z
  .object({
    nombre: z.string().min(2, 'Mínimo 2 caracteres'),
    correo: z.string().email('Correo inválido'),
    contrasena: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmarContrasena: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((d) => d.contrasena === d.confirmarContrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmarContrasena'],
  })

type LoginData = z.infer<typeof loginSchema>
type RegistroData = z.infer<typeof registroSchema>

function DecorShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-20" style={{ backgroundColor: '#55307E' }} />
      <div className="absolute top-10 right-8 w-40 h-40 rounded-full opacity-15" style={{ backgroundColor: '#80498F', transform: 'translateX(40%)' }} />
      <div className="absolute bottom-20 -left-10 w-48 h-48 opacity-10 rounded-2xl" style={{ backgroundColor: '#AD98C4', transform: 'rotate(-30deg)' }} />
      <div className="absolute bottom-40 right-16 w-14 h-14 rounded-xl opacity-30" style={{ backgroundColor: '#ED932C' }} />
      <div className="absolute top-0 right-20 w-0.5 h-full opacity-10" style={{ backgroundColor: '#AD98C4', transform: 'rotate(15deg)', transformOrigin: 'top' }} />
    </div>
  )
}

function InputField({ label, id, type, error, register, showToggle, onToggle }: {
  label: string; id: string; type: string; error?: string; register: object
  showToggle?: boolean; onToggle?: () => void
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={type}
          {...register}
          autoFocus={id === 'correo'}
          className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white
            focus:outline-none transition-colors ${error ? 'border-red-300' : focused ? 'border-primary' : 'border-gray-300'}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {showToggle && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Mostrar/ocultar contraseña"
          >
            {type === 'password' ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function PaginaLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<Tab>(() => searchParams.get('tab') === 'registro' ? 'registro' : 'login')
  const [showPasswords, setShowPasswords] = useState({ login: false, registro: false, confirmar: false })

  const { mutate: login, isPending: loginLoading, error: loginError } = useLogin()
  const { mutate: registro, isPending: registroLoading, error: registroError } = useRegistro()

  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) })
  const registroForm = useForm<RegistroData>({ resolver: zodResolver(registroSchema) })

  const redirect = searchParams.get('redirect')

  function onLogin(data: LoginData) {
    login(
      { correo: data.correo, contrasena: data.contrasena },
      {
        onSuccess: (resp) => {
          if (redirect) { navigate(redirect.replace(/^\/+/, '/')); return }
          const rol = resp.usuario.rol
          if (rol === 'ADMIN') navigate('/admin/categorias')
          else if (rol === 'INSTRUCTOR') navigate('/instructor/cursos')
          else navigate('/app/catalogo')
        },
      }
    )
  }

  function onRegistro(data: RegistroData) {
    registro(
      { nombre: data.nombre, correo: data.correo, contrasena: data.contrasena, rol: 'ESTUDIANTE' },
      { onSuccess: () => setTab('login') }
    )
  }

  const apiError = tab === 'login' ? loginError : registroError
  const activeError = (apiError as ApiError)?.response?.data?.error?.message

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden flex-col items-center justify-center px-16"
        style={{ background: 'linear-gradient(160deg, #250935 0%, #3a1a52 60%, #250935 100%)' }}
      >
        <DecorShapes />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-6">
            <img
            src={logoMMO}
            alt="MMO El Oro"
            className="w-96 h-auto drop-shadow-xl"
            />
          </div>
          <h1 className="text-white text-3xl font-bold tracking-wider mb-2">MMOC</h1>
          <p className="text-lg font-medium tracking-widest uppercase" style={{ color: '#ED932C' }}>Cursos</p>
          <div className="mt-8 w-20 h-0.5 rounded-full" style={{ backgroundColor: '#80498F' }} />
          <p className="text-soft-lavender text-sm mt-4 max-w-xs leading-relaxed">
            Formación gratuita para la defensa de los derechos de las mujeres
          </p>
        </div>
      </div>

      <div className="flex-1 lg:w-[42%] flex flex-col items-center justify-center bg-white px-8 py-12">
        <div className="lg:hidden flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mb-2">
            <BookOpen size={28} className="text-primary" />
          </div>
          <p className="text-sm font-semibold tracking-widest uppercase text-primary">MMO El Oro</p>
        </div>

        <div className="w-full max-w-sm">
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                tab === 'login'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setTab('registro')}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                tab === 'registro'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Registrarse
            </button>
          </div>

          {activeError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
              <AlertCircle size={15} className="shrink-0" />
              {activeError}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="flex flex-col gap-5">
              <InputField
                label="Correo electrónico"
                id="correo"
                type="email"
                error={loginForm.formState.errors.correo?.message}
                register={loginForm.register('correo')}
              />
              <InputField
                label="Contraseña"
                id="contrasena"
                type={showPasswords.login ? 'text' : 'password'}
                error={loginForm.formState.errors.contrasena?.message}
                register={loginForm.register('contrasena')}
                showToggle
                onToggle={() => setShowPasswords(p => ({ ...p, login: !p.login }))}
              />
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-primary text-white font-semibold rounded-lg py-2.5 text-sm
                  transition-all hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2 mt-1"
              >
                {loginLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Ingresando...</>
                ) : 'Iniciar sesión'}
              </button>
            </form>
          ) : (
            <form onSubmit={registroForm.handleSubmit(onRegistro)} className="flex flex-col gap-5">
              <InputField
                label="Nombre completo"
                id="nombre"
                type="text"
                error={registroForm.formState.errors.nombre?.message}
                register={registroForm.register('nombre')}
              />
              <InputField
                label="Correo electrónico"
                id="correo-reg"
                type="email"
                error={registroForm.formState.errors.correo?.message}
                register={registroForm.register('correo')}
              />
              <InputField
                label="Contraseña"
                id="contrasena-reg"
                type={showPasswords.registro ? 'text' : 'password'}
                error={registroForm.formState.errors.contrasena?.message}
                register={registroForm.register('contrasena')}
                showToggle
                onToggle={() => setShowPasswords(p => ({ ...p, registro: !p.registro }))}
              />
              <InputField
                label="Confirmar contraseña"
                id="confirmar"
                type={showPasswords.confirmar ? 'text' : 'password'}
                error={registroForm.formState.errors.confirmarContrasena?.message}
                register={registroForm.register('confirmarContrasena')}
                showToggle
                onToggle={() => setShowPasswords(p => ({ ...p, confirmar: !p.confirmar }))}
              />
              <button
                type="submit"
                disabled={registroLoading}
                className="w-full bg-primary text-white font-semibold rounded-lg py-2.5 text-sm
                  transition-all hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2 mt-1"
              >
                {registroLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Registrando...</>
                ) : 'Crear cuenta'}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">
              {tab === 'login' ? (
                <>¿No tienes cuenta?{' '}
                  <button onClick={() => setTab('registro')} className="text-primary hover:underline font-medium">
                    Regístrate
                  </button>
                </>
              ) : (
                <>¿Ya tienes cuenta?{' '}
                  <button onClick={() => setTab('login')} className="text-primary hover:underline font-medium">
                    Inicia sesión
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
