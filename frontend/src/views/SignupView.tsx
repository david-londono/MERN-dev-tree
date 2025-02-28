import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import ErrorMessage from "../components/ErrorMessage";
import type { SignupForm } from "../types";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import api from "../config/axios";

export default function SignupView() {
    const initialValues: SignupForm = {
        name: '',
        email: '',
        handle: '',
        password: '',
        password_confirmation: ''
    }
    const { register, reset, watch, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })
    const password = watch('password');
    const navigate = useNavigate();

    const handleSignup = async (formData: SignupForm) => {
        try {
            const { data } = await api.post(`/api/auth/signup`, formData);
            console.log(data);
            reset();
            toast.success('Cuenta creada exitosamente');
            navigate('/auth/login');
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.error);
            }  
        }
    }

    return (
        <>
            <h1 className="text-4xl text-white font-bold">Crear Cuenta</h1>

            <form
                onSubmit={handleSubmit(handleSignup)}
                className="bg-white px-5 py-10 rounded-lg space-y-10 mt-10"
            >
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="name" className="text-2xl text-slate-500">Nombre</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Tu Nombre"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && <ErrorMessage>{String(errors.name.message)}</ErrorMessage>}
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="email" className="text-2xl text-slate-500">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "E-mail no válido",
                            },
                        })}
                    />
                    {errors.email && <ErrorMessage>{String(errors.email.message)}</ErrorMessage>}
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="handle" className="text-2xl text-slate-500">Handle</label>
                    <input
                        id="handle"
                        type="text"
                        placeholder="Nombre de usuario: sin espacios"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('handle', { required: 'handle is required' })}
                    />
                    {errors.handle && <ErrorMessage>{String(errors.handle.message)}</ErrorMessage>}
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="password" className="text-2xl text-slate-500">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password de Registro"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('password', {
                            required: 'password is required',
                            minLength: {
                                value: 8,
                                message: 'password must have at least 8 characters'
                            }
                        })}
                    />
                    {errors.password && <ErrorMessage>{String(errors.password.message)}</ErrorMessage>}
                </div>

                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="password_confirmation" className="text-2xl text-slate-500">Repetir Password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Repetir Password"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('password_confirmation', {
                            required: 'password confirmation is required',
                            validate: value => value === password || 'passwords do not match'
                        })}
                    />
                    {errors.password_confirmation && <ErrorMessage>{String(errors.password_confirmation.message)}</ErrorMessage>}
                </div>

                <input
                    type="submit"
                    className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                    value='Crear Cuenta'
                />
            </form>

            <nav className="pt-10">
                <Link className="text-white text-center text-lg block" to="/auth/login"> ya tienes un cuenta? Inicia Sesion</Link>
            </nav>
        </>
    )
}