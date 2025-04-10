
import React from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Phone, MapPin } from "lucide-react";

export const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-neutral-800 text-neutral-100 px-3 sm:px-6 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        {/* Logo - Aumentada no mobile */}
        <div className="w-full flex justify-center sm:justify-start mb-1 sm:mb-0">
          <Link to="/">
            <img
              src="/lovable-uploads/89e612a8-2908-409e-9390-9cd2e694ad02.png"
              alt="Digital Car Logo"
              className="h-20 sm:h-16 md:h-20 transition-all duration-300 hover:scale-105 cursor-pointer"
            />
          </Link>
        </div>
        
        {/* Informações de contato - Escondidas no mobile */}
        {!isMobile && (
          <div className="flex flex-col sm:items-end w-full sm:w-auto">
            {/* Telefone com ícone para fácil visualização */}
            <a 
              href="tel:+5561981974187" 
              className="flex items-center justify-center sm:justify-end gap-2 mb-2 hover:text-gray-200 transition-colors"
            >
              <Phone size={isMobile ? 20 : 16} className="text-[#FF0000]" />
              <span className="text-sm sm:text-base font-bold">(61) 98197-4187</span>
            </a>
            
            {/* Endereço com ícone */}
            <a 
              href="https://g.co/kgs/XKMEZMv" 
              className="flex items-center justify-center sm:justify-end gap-2 hover:text-gray-200 transition-colors mb-3 sm:mb-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin size={isMobile ? 20 : 16} className="text-[#FF0000] flex-shrink-0" />
              <div className="text-xs text-center sm:text-right sm:text-sm font-medium">
                Qsd 23 lote 04 Taguatinga Sul Pistão Sul - CEP 72020230
              </div>
            </a>
          </div>
        )}
          
        {/* Social icons - Mantidos em ambas as versões, agora com mais espaço no desktop */}
        <div className={`flex justify-center gap-4 ${isMobile ? 'mt-1 mb-1' : 'ml-6'}`}>
          <a href="https://www.instagram.com/digitalcar_?igsh=NmM0MDYxamRzbm1q" aria-label="Instagram" className="text-white hover:text-gray-300" target="_blank" rel="noopener noreferrer">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<svg id="206:20" layer-name="instagram 2" width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[20px] h-[20px]"> <g clip-path="url(#clip0_206_20)"> <path d="M15 0C10.9294 0 10.4175 0.01875 8.81812 0.09C7.21875 0.165 6.12937 0.41625 5.175 0.7875C4.17346 1.16311 3.26651 1.75387 2.51813 2.51813C1.75387 3.26651 1.16311 4.17346 0.7875 5.175C0.41625 6.1275 0.163125 7.21875 0.09 8.8125C0.01875 10.4156 0 10.9256 0 15.0019C0 19.0744 0.01875 19.5844 0.09 21.1838C0.165 22.7812 0.41625 23.8706 0.7875 24.825C1.17188 25.8112 1.68375 26.6475 2.51813 27.4819C3.35063 28.3162 4.18687 28.83 5.17313 29.2125C6.12937 29.5837 7.21688 29.8369 8.81437 29.91C10.4156 29.9812 10.9256 30 15 30C19.0744 30 19.5825 29.9812 21.1838 29.91C22.7794 29.835 23.8725 29.5837 24.8269 29.2125C25.8277 28.8366 26.734 28.2459 27.4819 27.4819C28.3162 26.6475 28.8281 25.8112 29.2125 24.825C29.5819 23.8706 29.835 22.7812 29.91 21.1838C29.9812 19.5844 30 19.0744 30 15C30 10.9256 29.9812 10.4156 29.91 8.81437C29.835 7.21875 29.5819 6.1275 29.2125 5.175C28.8369 4.17346 28.2461 3.26651 27.4819 2.51813C26.7335 1.75387 25.8265 1.16311 24.825 0.7875C23.8687 0.41625 22.7775 0.163125 21.1819 0.09C19.5806 0.01875 19.0725 0 14.9963 0H15ZM13.6556 2.70375H15.0019C19.0069 2.70375 19.4812 2.71688 21.0619 2.79C22.5244 2.85563 23.3194 3.10125 23.8481 3.30562C24.5475 3.5775 25.0481 3.90375 25.5731 4.42875C26.0981 4.95375 26.4225 5.4525 26.6944 6.15375C26.9006 6.68062 27.1444 7.47563 27.21 8.93813C27.2831 10.5188 27.2981 10.9931 27.2981 14.9963C27.2981 18.9994 27.2831 19.4756 27.21 21.0562C27.1444 22.5187 26.8988 23.3119 26.6944 23.8406C26.4522 24.4911 26.0686 25.0796 25.5712 25.5637C25.0462 26.0887 24.5475 26.4131 23.8463 26.685C23.3213 26.8913 22.5262 27.135 21.0619 27.2025C19.4812 27.2738 19.0069 27.2906 15.0019 27.2906C10.9969 27.2906 10.5206 27.2738 8.94 27.2025C7.4775 27.135 6.68437 26.8913 6.15562 26.685C5.50469 26.4436 4.9155 26.0606 4.43062 25.5637C3.93239 25.0793 3.54812 24.49 3.30562 23.8387C3.10125 23.3119 2.85563 22.5169 2.79 21.0544C2.71875 19.4738 2.70375 18.9994 2.70375 14.9925C2.70375 10.9856 2.71875 10.515 2.79 8.93437C2.8575 7.47187 3.10125 6.67688 3.3075 6.14813C3.57938 5.44875 3.90562 4.94812 4.43062 4.42312C4.95563 3.89812 5.45437 3.57375 6.15562 3.30188C6.68437 3.09563 7.4775 2.85188 8.94 2.78437C10.3238 2.72062 10.86 2.70188 13.6556 2.7V2.70375ZM23.0081 5.19375C22.7717 5.19375 22.5377 5.24031 22.3193 5.33077C22.1009 5.42123 21.9025 5.55381 21.7353 5.72096C21.5682 5.8881 21.4356 6.08653 21.3451 6.30492C21.2547 6.52331 21.2081 6.75737 21.2081 6.99375C21.2081 7.23013 21.2547 7.46419 21.3451 7.68258C21.4356 7.90097 21.5682 8.0994 21.7353 8.26654C21.9025 8.43369 22.1009 8.56627 22.3193 8.65673C22.5377 8.74719 22.7717 8.79375 23.0081 8.79375C23.4855 8.79375 23.9434 8.60411 24.2809 8.26654C24.6185 7.92898 24.8081 7.47114 24.8081 6.99375C24.8081 6.51636 24.6185 6.05852 24.2809 5.72096C23.9434 5.38339 23.4855 5.19375 23.0081 5.19375ZM15.0019 7.2975C13.9801 7.28156 12.9654 7.46904 12.0168 7.84901C11.0682 8.22899 10.2047 8.79388 9.47653 9.51079C8.74835 10.2277 8.17006 11.0823 7.77533 12.0249C7.3806 12.9674 7.17731 13.9791 7.17731 15.0009C7.17731 16.0228 7.3806 17.0345 7.77533 17.977C8.17006 18.9196 8.74835 19.7742 9.47653 20.4911C10.2047 21.208 11.0682 21.7729 12.0168 22.1529C12.9654 22.5328 13.9801 22.7203 15.0019 22.7044C17.0241 22.6728 18.9529 21.8473 20.3718 20.4061C21.7908 18.9649 22.5861 17.0234 22.5861 15.0009C22.5861 12.9784 21.7908 11.037 20.3718 9.59578C18.9529 8.15454 17.0241 7.32905 15.0019 7.2975ZM15.0019 9.99938C15.6586 9.99938 16.3088 10.1287 16.9155 10.38C17.5222 10.6313 18.0735 10.9997 18.5379 11.464C19.0022 11.9284 19.3705 12.4796 19.6219 13.0863C19.8732 13.693 20.0025 14.3433 20.0025 15C20.0025 15.6567 19.8732 16.307 19.6219 16.9137C19.3705 17.5204 19.0022 18.0716 18.5379 18.536C18.0735 19.0003 17.5222 19.3687 16.9155 19.62C16.3088 19.8713 15.6586 20.0006 15.0019 20.0006C13.6756 20.0006 12.4037 19.4738 11.4659 18.536C10.5281 17.5982 10.0013 16.3262 10.0013 15C10.0013 13.6738 10.5281 12.4018 11.4659 11.464C12.4037 10.5262 13.6756 9.99938 15.0019 9.99938Z" fill="#F5F5F5"></path> </g> <defs> <clipPath id="clip0_206_20"> <rect width="30" height="30" fill="white"></rect> </clipPath> </defs> </svg>',
              }}
            />
          </a>
          <a href="https://wa.me/5561981974187" aria-label="WhatsApp" className="text-white hover:text-gray-300" target="_blank" rel="noopener noreferrer">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<svg id="197:13" layer-name="Vector" width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[20px] h-[20px]"> <path d="M25.6171 4.36134C24.2358 2.9729 22.5906 1.87218 20.7774 1.1234C18.9643 0.374618 17.0195 -0.00723902 15.0565 0.000103922C6.83136 0.000103922 0.128076 6.67133 0.120542 14.8613C0.120542 17.4844 0.809895 20.0363 2.11138 22.2957L0 30L7.91813 27.9338C10.1076 29.1229 12.5623 29.7451 15.0565 29.7431H15.064C23.2911 29.7431 29.9925 23.0719 30 14.8744C30.0017 12.9208 29.6151 10.9861 28.8626 9.18184C28.1101 7.37755 27.0083 5.73927 25.6171 4.36134ZM15.0565 27.2269C12.8324 27.2251 10.6496 26.6294 8.73556 25.5019L8.28352 25.2319L3.58614 26.4581L4.84053 21.8963L4.54671 21.4257C3.30325 19.4575 2.64562 17.1788 2.65005 14.8538C2.65005 8.05508 8.21949 2.50885 15.064 2.50885C16.6946 2.50593 18.3097 2.82436 19.8161 3.44576C21.3225 4.06717 22.6904 4.97926 23.841 6.12946C24.9954 7.27536 25.9106 8.63734 26.5338 10.1369C27.1571 11.6365 27.476 13.2441 27.4724 14.8669C27.4648 21.69 21.8954 27.2269 15.0565 27.2269ZM21.8653 17.9757C21.4942 17.79 19.6616 16.8919 19.3169 16.7644C18.9741 16.6425 18.7236 16.5788 18.4788 16.95C18.2283 17.3194 17.5126 18.1613 17.2978 18.4032C17.0831 18.6525 16.8609 18.6807 16.4879 18.4969C16.1169 18.3094 14.9134 17.9194 13.4895 16.65C12.3782 15.6657 11.6342 14.4469 11.412 14.0776C11.1973 13.7063 11.3913 13.5076 11.5777 13.3219C11.7416 13.1569 11.9488 12.8869 12.1352 12.6732C12.3236 12.4594 12.3857 12.3019 12.5082 12.0544C12.6306 11.8032 12.5722 11.5894 12.4799 11.4038C12.3857 11.2182 11.6418 9.38632 11.3272 8.64757C11.0259 7.9182 10.7189 8.01945 10.4891 8.01008C10.2744 7.99695 10.0239 7.99695 9.77335 7.99695C9.5842 8.00174 9.39808 8.04535 9.22664 8.12504C9.0552 8.20473 8.90212 8.31879 8.77699 8.46007C8.4342 8.83132 7.47551 9.72945 7.47551 11.5613C7.47551 13.3932 8.81278 15.1538 9.00113 15.4032C9.18571 15.6526 11.6267 19.4007 15.3729 21.0132C16.2582 21.3975 16.955 21.6244 17.4994 21.7969C18.394 22.0819 19.202 22.0388 19.8462 21.9469C20.5619 21.8382 22.0517 21.0469 22.3663 20.1788C22.6752 19.3088 22.6752 18.5663 22.581 18.4107C22.4887 18.2532 22.2382 18.1613 21.8653 17.9757Z" fill="#F5F5F5"></path> </svg>',
              }}
            />
          </a>
          <a href="https://g.co/kgs/XKMEZMv" aria-label="Location" className="text-white hover:text-gray-300" target="_blank" rel="noopener noreferrer">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<svg id="206:22" layer-name="geo-alt 2" width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[20px] h-[20px]"> <g clip-path="url(#clip0_206_22)"> <path d="M22.8113 16.7625C21.8288 18.7537 20.4975 20.7375 19.1363 22.5188C17.8435 24.1969 16.4628 25.8054 15 27.3375C13.5372 25.8054 12.1565 24.1969 10.8638 22.5188C9.5025 20.7375 8.17125 18.7537 7.18875 16.7625C6.195 14.7506 5.625 12.8663 5.625 11.25C5.625 8.7636 6.61272 6.37903 8.37087 4.62087C10.129 2.86272 12.5136 1.875 15 1.875C17.4864 1.875 19.871 2.86272 21.6291 4.62087C23.3873 6.37903 24.375 8.7636 24.375 11.25C24.375 12.8663 23.8031 14.7506 22.8113 16.7625ZM15 30C15 30 26.25 19.3388 26.25 11.25C26.25 8.26631 25.0647 5.40483 22.955 3.29505C20.8452 1.18526 17.9837 0 15 0C12.0163 0 9.15483 1.18526 7.04505 3.29505C4.93526 5.40483 3.75 8.26631 3.75 11.25C3.75 19.3388 15 30 15 30Z" fill="white"></path> <path d="M15 15C14.0054 15 13.0516 14.6049 12.3483 13.9017C11.6451 13.1984 11.25 12.2446 11.25 11.25C11.25 10.2554 11.6451 9.30161 12.3483 8.59835C13.0516 7.89509 14.0054 7.5 15 7.5C15.9946 7.5 16.9484 7.89509 17.6516 8.59835C18.3549 9.30161 18.75 10.2554 18.75 11.25C18.75 12.2446 18.3549 13.1984 17.6516 13.9017C16.9484 14.6049 15.9946 15 15 15ZM15 16.875C16.4918 16.875 17.9226 16.2824 18.9775 15.2275C20.0324 14.1726 20.625 12.7418 20.625 11.25C20.625 9.75816 20.0324 8.32742 18.9775 7.27252C17.9226 6.21763 16.4918 5.625 15 5.625C13.5082 5.625 12.0774 6.21763 11.0225 7.27252C9.96763 8.32742 9.375 9.75816 9.375 11.25C9.375 12.7418 9.96763 14.1726 11.0225 15.2275C12.0774 16.2824 13.5082 16.875 15 16.875Z" fill="white"></path> </g> <defs> <clipPath id="clip0_206_22"> <rect width="30" height="30" fill="white"></rect> </clipPath> </defs> </svg>',
              }}
            />
          </a>
        </div>
      </div>
    </header>
  );
};
