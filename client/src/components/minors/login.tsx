import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button.tsx';
import { Input } from '../ui/input.tsx';
import { Label } from '../ui/label.tsx';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [formData, setFormData] = useState({
        Dni: '',
        Password: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous error message

        try {
            const response = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!data.data) {
                if (data.error) {
                    setErrorMessage(data.error); // Display error message from response
                } else {
                    setErrorMessage('Error desconocido'); // Generic error message
                }
                setFormData({ Dni: '', Password: '' }); // Clear form fields
                return;
            }

            localStorage.setItem('user', JSON.stringify(data.data));
            if (data.data.Rol === 'admin') {
                navigate('/users');
            } else {
                navigate('/projects');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error de red, por favor intente nuevamente'); // Network error message
            setFormData({ Dni: '', Password: '' }); // Clear form fields
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const userObj = JSON.parse(user);
            if (userObj.Rol === 'admin') {
                navigate('/users');
            } else {
                navigate('/projects');
            }
        }
    }, []);

    return (
        <div className='h-screen w-screen flex items-center justify-center flex-col gap-3 '>
            <h3 className='text-2xl font-bold text-black font-bold bg-white p-2 rounded'>INICIAR SESIÓN</h3>
            <p className='text-sm text-black font-bold bg-white p-2 rounded'>
                Complete los campos
            </p>


            {errorMessage && (
                <p className='text-red-500'>{errorMessage}</p>
            )}

            <form autoComplete='off' onSubmit={onSubmit} className='flex flex-col gap-2 mt-2 text-sm text-black font-bold bg-white p-2 rounded'>
                <Label className='mb-2'>
                    Dni <span className='text-red-400'>*</span>
                    <Input
                        className='mt-2'
                        type="text"
                        placeholder="00000000"
                        name="Dni"
                        value={formData.Dni}
                        onChange={handleChange}
                    />
                </Label>

                <Label className='mb-2'>
                    Contraseña <span className='text-red-400'>*</span>
                    <Input
                        className='mt-2'
                        type="password" // Cambiado a type="password" para ocultar la contraseña
                        placeholder="***********"
                        name="Password"
                        value={formData.Password}
                        onChange={handleChange}
                    />
                </Label>

                <Button type="submit">Iniciar Sesión</Button>
            </form>
        </div>
    );
}
