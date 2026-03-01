import { useState } from 'react';
import './Login.scss';
import { authService } from '../services/authService';
import axios from 'axios';
import { useForm } from 'react-hook-form';

interface FormValues {
	nombre?: string;
	usuario: string;
	password: string;
}

export default function Login() {
	const [isLogin, setIsLogin] = useState(true);
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<FormValues>();

	const toggle = (e: React.SyntheticEvent, value: boolean) => {
		e.preventDefault();
		setIsLogin(value);
		reset();
	};

	const onSubmit = async (form: FormValues) => {
		setLoading(true);

		try {
			const data = isLogin
				? await authService.login(form.usuario, form.password)
				: await authService.register(form.nombre!, form.usuario, form.password);

			localStorage.setItem('token', data.access_token);
			localStorage.setItem('user_name', data.nombre);
			localStorage.setItem('user_handle', data.usuario);
			window.dispatchEvent(new Event('storage'));

			alert(isLogin ? `¡Bienvenido de nuevo, ${data.nombre}!` : '¡Cuenta creada con éxito!');

			window.location.href = '/';
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const message = err.response?.data?.detail || 'Error en las credenciales';
				alert(message);
			} else {
				alert('Ocurrió un error inesperado');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='login-container'>
			<div className='textMobile'>
				<h1>{isLogin ? 'Bienvenido de nuevo' : 'Empieza ahora'}</h1>
				<p>
					{isLogin
						? 'Inicia sesión para acceder a todas las funcionalidades.'
						: 'Crea tu cuenta y accede a todas las funcionalidades.'}
				</p>
			</div>
			<form
				className='formulario'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='text'>
					<h1>{isLogin ? 'Bienvenido de nuevo' : 'Empieza ahora'}</h1>
					<p>
						{isLogin
							? 'Inicia sesión para acceder a todas las funcionalidades.'
							: 'Crea tu cuenta y accede a todas las funcionalidades.'}
					</p>
				</div>
				<div className='toggles'>
					<button
						type='button'
						className={`btn-default ${isLogin ? '' : 'off'}`}
						onClick={(e) => {
							toggle(e, true);
						}}
						disabled={loading}
					>
						Iniciar Sesión
					</button>
					<button
						type='button'
						className={`btn-default ${isLogin ? 'off' : ''}`}
						onClick={(e) => {
							toggle(e, false);
						}}
						disabled={loading}
					>
						Registrarse
					</button>
				</div>
				<div className='inputs'>
					{!isLogin && (
						<div className='inputTitle'>
							<p>Nombre</p>
							<input
								type='text'
								placeholder='Nombre'
								{...register('nombre', {
									required: 'El nombre es obligatorio',
									minLength: {
										value: 2,
										message: 'Mínimo 2 caracteres',
									},
									maxLength: {
										value: 20,
										message: 'Máximo 20 caracteres',
									},
								})}
							/>
							{errors.nombre && (
								<p className='error'>{errors.nombre.message}</p>
							)}
						</div>
					)}
					<div className='inputTitle'>
						<p>Usuario</p>
						<input
							type='text'
							placeholder='Usuario'
							{...register('usuario', {
								required: 'El usuario es obligatorio',
								minLength: { value: 3, message: 'Mínimo 3 caracteres' },
								maxLength: {
									value: 15,
									message: 'Máximo 15 caracteres',
								},
								pattern: {
									value: /^\S+$/,
									message: 'No puede contener espacios',
								},
							})}
						/>
						{errors.usuario && <p className='error'>{errors.usuario.message}</p>}
					</div>
					<div className='inputTitle'>
						<p>Contaseña</p>
						<input
							type='password'
							placeholder='Contraseña'
							{...register('password', {
								required: 'La contraseña es obligatoria',
								minLength: { value: 6, message: 'Mínimo 6 caracteres' },
								maxLength: {
									value: 100,
									message: 'Máximo 100 caracteres',
								},
							})}
						/>
						{errors.password && <p className='error'>{errors.password.message}</p>}
					</div>
				</div>
				<button
					type='submit'
					className='btn-default'
					disabled={loading}
				>
					{isLogin ? 'Iniciar Sesión' : 'Registrarse'}
				</button>
			</form>
		</div>
	);
}
