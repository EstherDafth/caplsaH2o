import React, { useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function HomePage() {
    useEffect(() => {
        // Creamos y añadimos el <df-messenger> al body solo una vez
        const existing = document.querySelector('df-messenger');
        if (!existing) {
            const script = document.createElement('script');
            script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
            script.async = true;
            document.body.appendChild(script);

            const dfMessenger = document.createElement('df-messenger');
            dfMessenger.setAttribute('chat-title', 'ERBY');
            dfMessenger.setAttribute('agent-id', '1cbe2a4c-06b7-4e56-be75-604dc7d9c180');
            dfMessenger.setAttribute('language-code', 'es');
            document.body.appendChild(dfMessenger);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-250 dark:to-gray-700 flex flex-col items-center justify-center p-6">

            {/* Logo */}
            <a href="/">
                <img src="/images/agua.png" alt="Logo" className="h-64 w-64" />
            </a>

            {/* Título de bienvenida */}
            <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-4">
                ¡Bienvenido a Nuestra Plataforma!
            </h1>
            <p className="text-lg text-center text-gray-800 dark:text-gray-800 mb-10 max-w-xl">
                Desde aquí puedes acceder a tus funcionalidades principales.
                Si aún no tienes una cuenta, puedes registrarte fácilmente.
            </p>

            {/* Botones de acción */}
            <div className="flex gap-4 mb-10">
                <Link
                    href={route('login')}
                    className="rounded-md px-6 py-3 bg-white text-black ring-1 ring-gray-300 shadow transition hover:bg-gray-100 focus:outline-none focus-visible:ring-[#FF2D20] dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus-visible:ring-white"
                >
                    Entrar
                </Link>
                <Link
                    href={route('register')}
                    className="rounded-md px-6 py-3 bg-white text-black ring-1 ring-gray-300 shadow transition hover:bg-gray-100 focus:outline-none focus-visible:ring-[#FF2D20] dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus-visible:ring-white"
                >
                    Registrar
                </Link>
            </div>

            {/* Cards de presentación */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        Tu información a tu alcance
                    </h2>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300 list-disc list-inside">
                        <li>
                            Esta plataforma te otorgará acceso rápido y fácil a documentación de tu interés.
                        </li>
                        <li>
                            <span className="font-semibold">Contáctanos:</span> Tel: 248 268 1953
                        </li>
                        <li>
                            <span className="font-semibold">Dirección:</span> Calle Miguel Hidalgo #913, San Matías
                            Tlalancaleca
                        </li>
                    </ul>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Servicios</h2>
                    <ul className="list-disc list-inside text-gray-200">
                                           </ul>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        ¿Eres usuario nuevo y tienes dudas?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                    </p>
                </div>
            </div>
        </div>
    );
}

