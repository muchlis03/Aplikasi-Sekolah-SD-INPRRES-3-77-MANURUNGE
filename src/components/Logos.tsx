import React from 'react';

interface SchoolLogoProps {
  large?: boolean;
  src?: string;
}

export function SchoolLogo({ large, src }: SchoolLogoProps) {
  const size = large ? "w-32 h-32" : "w-10 h-10";
  
  if (src) {
    return (
      <img 
        src={src} 
        alt="Logo Sekolah" 
        className={`${size} flex-shrink-0 object-cover rounded-full border border-gray-200 shadow-sm bg-white`} 
      />
    );
  }
  
  return (
    <div className={`${size} flex-shrink-0 relative overflow-hidden flex items-center justify-center bg-[#f7f4ee] rounded-full border border-gray-200 shadow-sm`}>
       <svg viewBox="0 0 200 200" className="w-full h-full">
         <defs>
            <path id={`arc-${large ? 'lg' : 'sm'}`} d="M 30,100 A 70,70 0 0,1 170,100" fill="transparent" />
         </defs>
         <circle cx="100" cy="100" r="95" fill="#1b3b64" />
         <circle cx="100" cy="100" r="82" fill="#f7f4ee" />
         <g clipPath={`url(#clip-${large ? 'lg' : 'sm'})`}>
           <clipPath id={`clip-${large ? 'lg' : 'sm'}`}>
             <circle cx="100" cy="100" r="82" />
           </clipPath>
           <rect x="0" y="40" width="200" height="90" fill="#ea8033" />
           <rect x="0" y="55" width="200" height="5" fill="#f7f4ee" />
           <rect x="0" y="75" width="200" height="5" fill="#f7f4ee" />
           <rect x="0" y="95" width="200" height="5" fill="#f7f4ee" />
           <rect x="0" y="115" width="200" height="5" fill="#f7f4ee" />
           <path d="M 0,125 L 200,125 L 200,200 L 0,200 Z" fill="#c93c32" />
         </g>
         <text fill="#1b3b64" fontSize="16" fontWeight="bold" letterSpacing="2">
           <textPath href={`#arc-${large ? 'lg' : 'sm'}`} startOffset="50%" textAnchor="middle">
             SD INPRES 3/77 MANURUNGE
           </textPath>
         </text>
         <circle cx="28" cy="110" r="4" fill="#1b3b64" />
         <circle cx="172" cy="110" r="4" fill="#1b3b64" />
         <text x="100" y="142" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" letterSpacing="1">ININNAWA MADECENG</text>
         <text x="100" y="158" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" letterSpacing="1">LEARNING COMMUNITY</text>
         <path d="M 70,165 L 130,165 C 135,165 140,170 135,175 L 130,185 C 125,190 75,190 70,185 L 65,175 C 60,170 65,165 70,165 Z" fill="#f7f4ee" />
         <text x="100" y="178" textAnchor="middle" fill="#1b3b64" fontSize="9" fontWeight="bold">ESTD.2023</text>
         <g transform="translate(45, 55) scale(0.9)">
            <path d="M 80,70 Q 75,40 60,30 Q 70,50 65,80 Q 75,85 85,75 Z" fill="#eab327" />
            <circle cx="70" cy="20" r="8" fill="#eab327" />
            <path d="M 60,75 Q 50,45 40,35 Q 55,55 50,85 Q 60,85 65,75 Z" fill="#7a96ab" />
            <circle cx="50" cy="25" r="7" fill="#7a96ab" />
            <path d="M 45,80 Q 35,50 25,45 Q 40,65 35,90 Q 45,90 50,80 Z" fill="#1d3ba0" />
            <circle cx="35" cy="35" r="7" fill="#1d3ba0" />
            <path d="M 25,85 Q 15,60 10,55 Q 25,75 20,95 Q 30,95 30,85 Z" fill="#cb3434" />
            <circle cx="20" cy="45" r="7" fill="#cb3434" />
            <path d="M 50,15 L 80,5 L 110,15 L 80,25 Z" fill="#222" />
            <rect x="75" y="25" width="10" height="5" fill="#222" />
            <path d="M 0,25 Q 30,10 60,15 L 30,35 Z" fill="#7ab342" />
            <path d="M 5,30 Q 30,20 50,25 L 20,45 Z" fill="#3a5fb4" />
            <path d="M 10,35 Q 30,25 40,35 L 15,50 Z" fill="#d23232" />
         </g>
       </svg>
    </div>
  );
}

export function TutWuriLogo({ className = "w-28 h-28" }: { className?: string }) {
  return (
    <div className={`${className} flex-shrink-0 relative flex items-center justify-center filter drop-shadow-xl`}>
       <img 
         src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg" 
         alt="Logo Tut Wuri Handayani" 
         className="w-full h-full object-contain drop-shadow-md"
       />
    </div>
  );
}
