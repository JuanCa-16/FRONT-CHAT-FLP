import { useState } from 'react';
import './Login.scss';
import { authService } from '../services/authService';
import axios from 'axios';

export default function Login() {
	const [isLogin, setIsLogin] = useState(true);
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({ usuario: '', password: '', nombre: '' });

	const toggle = (e: React.SyntheticEvent) => {
		e.preventDefault();
		setIsLogin(!isLogin);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const data = isLogin
				? await authService.login(form.usuario, form.password)
				: await authService.register(form.nombre, form.usuario, form.password);

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
				onSubmit={handleSubmit}
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
						onClick={toggle}
						disabled={loading}
					>
						Iniciar Sesión
					</button>
					<button
						type='button'
						className={`btn-default ${isLogin ? 'off' : ''}`}
						onClick={toggle}
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
								required
								onChange={(e) =>
									setForm({ ...form, nombre: e.target.value })
								}
							/>
						</div>
					)}
					<div className='inputTitle'>
						<p>Usuario</p>
						<input
							type='text'
							placeholder='Usuario'
							required
							onChange={(e) => setForm({ ...form, usuario: e.target.value })}
						></input>
					</div>
					<div className='inputTitle'>
						<p>Contaseña</p>
						<input
							type='password'
							placeholder='Contraseña'
							required
							onChange={(e) => setForm({ ...form, password: e.target.value })}
						></input>
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
