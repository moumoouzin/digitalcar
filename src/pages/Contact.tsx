
import React from "react";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare } from "lucide-react";

const Contact = () => {
  const handleWhatsAppContact = () => {
    window.open("https://wa.me/5561981974187", "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen font-inter">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <Header />
      <Navigation />
      
      <main className="flex-grow bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Entre em Contato</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Estamos aqui para ajudar com qualquer dúvida sobre nossos veículos, financiamento ou agendamento de visitas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Fale Conosco</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <Phone className="text-red-600 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Telefone/WhatsApp</h3>
                    <p className="text-gray-600">+55 61 8197-4187</p>
                    <p className="text-sm text-gray-500 mt-1">Segunda a Sábado, 8h às 18h</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <MessageSquare className="text-red-600 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Atendimento Instantâneo</h3>
                    <p className="text-gray-600">Envie uma mensagem pelo WhatsApp e receba atendimento rápido</p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleWhatsAppContact}
                  className="w-full mt-4 bg-[#25D366] hover:bg-[#20BD5C] text-white flex items-center justify-center gap-2"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="white" 
                    stroke="white" 
                    strokeWidth="1" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M21.11 4.93C19.97 3.79 18.61 2.88 17.1 2.27C15.6 1.67 14 1.35 12.35 1.35C10.7 1.35 9.1 1.67 7.6 2.27C6.1 2.88 4.73 3.79 3.6 4.93C2.46 6.06 1.55 7.42 0.95 8.93C0.34 10.43 0.03 12.03 0.03 13.68C0.03 15.84 0.56 17.9 1.61 19.72L0 24L4.4 22.39C6.17 23.35 8.18 23.83 10.26 23.83H10.27C11.92 23.83 13.52 23.51 15.02 22.91C16.53 22.3 17.89 21.39 19.03 20.26C20.16 19.12 21.07 17.75 21.68 16.25C22.28 14.75 22.6 13.14 22.6 11.49C22.6 9.84 22.28 8.24 21.68 6.74C21.07 5.23 20.16 3.86 19.03 2.73L21.11 4.93ZM12.35 21.95H12.34C10.48 21.95 8.66 21.48 7.07 20.59L6.72 20.38L2.92 21.35L3.91 17.65L3.67 17.28C2.69 15.64 2.17 13.73 2.17 11.76C2.17 6.84 6.77 2.88 12.35 2.88C14.02 2.88 15.61 3.26 17.04 3.98C18.47 4.71 19.69 5.72 20.65 6.98C21.62 8.24 22.32 9.7 22.71 11.26C23.11 12.83 23.2 14.46 22.96 16.06C22.72 17.66 22.17 19.18 21.34 20.5C20.5 21.83 19.39 22.93 18.1 23.76C16.8 24.58 15.35 25.1 13.84 25.27C12.33 25.45 10.81 25.28 9.38 24.77C7.95 24.26 6.66 23.42 5.6 22.32L12.35 21.95ZM17.99 14.67C17.67 14.51 16.22 13.79 15.93 13.69C15.63 13.59 15.43 13.54 15.22 13.85C15.02 14.17 14.45 14.83 14.27 15.04C14.09 15.25 13.91 15.27 13.59 15.12C13.27 14.96 12.32 14.65 11.2 13.64C10.32 12.85 9.73 11.89 9.55 11.57C9.37 11.25 9.53 11.09 9.69 10.93C9.83 10.8 10 10.58 10.16 10.41C10.31 10.24 10.36 10.11 10.46 9.91C10.56 9.7 10.51 9.54 10.44 9.38C10.36 9.23 9.77 7.78 9.52 7.15C9.27 6.53 9.01 6.61 8.82 6.6C8.64 6.59 8.43 6.59 8.23 6.59C8.02 6.59 7.67 6.66 7.38 6.98C7.08 7.3 6.3 8.02 6.3 9.47C6.3 10.92 7.39 12.31 7.54 12.52C7.7 12.72 9.73 15.82 12.8 17.09C13.57 17.42 14.18 17.62 14.66 17.77C15.44 18.02 16.14 17.98 16.7 17.91C17.32 17.82 18.51 17.19 18.77 16.46C19.03 15.73 19.03 15.11 18.95 14.98C18.88 14.85 18.67 14.77 18.35 14.62L17.99 14.67Z"/>
                  </svg>
                  Conversar no WhatsApp
                </Button>
              </div>
            </div>
            
            <div className="hidden md:block">
              <img 
                src="/lovable-uploads/89e612a8-2908-409e-9390-9cd2e694ad02.png" 
                alt="Digital Car Logo" 
                className="max-w-xs mx-auto mb-8"
              />
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Por que escolher a Digital Car?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-600"></div>
                    <span>Atendimento personalizado e ágil</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-600"></div>
                    <span>Veículos com procedência garantida</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-600"></div>
                    <span>Facilidade no financiamento</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-600"></div>
                    <span>Transparência em todas as negociações</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
