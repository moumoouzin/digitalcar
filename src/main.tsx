import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Configurar tratamento global de erros
const handleGlobalError = (event: ErrorEvent) => {
  console.error('Erro global não capturado:', event.error);
  // Prevenir que o erro quebre a aplicação inteira
  event.preventDefault();
  
  // Renderizar uma mensagem de erro amigável
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; text-align: center;">
        <h2 style="color: #d32f2f;">Ocorreu um erro</h2>
        <p>Ocorreu um problema ao carregar a aplicação. Por favor, tente recarregar a página.</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Recarregar página
        </button>
        <p style="margin-top: 20px; font-size: 14px; color: #666;">
          Se o problema persistir, entre em contato com o suporte técnico.
        </p>
      </div>
    `;
  }
};

// Registrar o tratador de erros global
window.addEventListener('error', handleGlobalError);

// Renderizar a aplicação normalmente
try {
  const root = createRoot(document.getElementById('root')!);
  root.render(<App />);
} catch (error) {
  console.error('Erro ao renderizar aplicação:', error);
  handleGlobalError(new ErrorEvent('error', { error }));
}
