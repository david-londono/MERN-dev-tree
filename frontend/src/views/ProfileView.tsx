import { useForm } from 'react-hook-form';
import { useQueryClient, useMutation } from '@tanstack/react-query'
import ErrorMessage from '../components/ErrorMessage';
import { ProfileForm, User } from '../types';
import { updateProfile, uploadImage } from '../api/DevTreeAPI';
import { toast } from 'sonner';

export default function ProfileView() {

    const queryClient = useQueryClient();
    const data: User = queryClient.getQueryData(['user'])!;
    
    const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({defaultValues: {
        handle: data.handle,
        description: data.description
    }});

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onError: (error: Error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({queryKey: ['user']});
        }

    });

    const updateImageMutation = useMutation({
        mutationFn: uploadImage,
        onError: (error: Error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            // another way to update the user query using optimistic updates
            queryClient.setQueryData(['user'], (oldData: User) => {
                return {
                    ...oldData,
                    image: data.image
                }
            });
            
        }
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (!event.target.files) return;
        const file = event.target.files[0];
        updateImageMutation.mutate(file);

    }

    const handleUserProfileForm = (formData: ProfileForm) => {
        const user: User = queryClient.getQueryData(['user'])!
        user.description = formData.description;
        user.handle = formData.handle;

        updateProfileMutation.mutate(user)
    }

    return (
        <form
            className="bg-white p-10 rounded-lg space-y-5"
            onSubmit={handleSubmit(handleUserProfileForm)}
        >
            <legend className="text-2xl text-slate-800 text-center">Editar Información</legend>
            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >Handle:</label>
                <input
                    type="text"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="handle o Nombre de Usuario"
                    {...register("handle", {
                        required: "El handle es obligatorio"
                    })}
                />
                {errors.handle && (
                    <ErrorMessage>{errors.handle.message}</ErrorMessage>
                )}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="description"
                >Descripción:</label>
                <textarea
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="Tu Descripción"
                    {...register("description", {
                        required: "La descipcion es obligatorio"
                    })}
                />
                {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >Imagen:</label>
                <input
                    id="image"
                    type="file"
                    name="handle"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    accept="image/*"
                    onChange={handleChange}
                />
            </div>

            <input
                type="submit"
                className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                value='Guardar Cambios'
            />
        </form>
    )
}