import React from 'react';

const FullScreenLoader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-50 animate-fade-in">
            <div className="text-white text-2xl flex flex-col items-center">
                <div className="loader mb-4"></div>
                Cargando...
            </div>
        </div>
    );
};

export default FullScreenLoader;
