const BatwomanSilhouette = () => {
  return (
    <svg
      viewBox="0 0 120 160"
      className="absolute bottom-2 right-2 w-16 h-20 pointer-events-none opacity-0 group-hover:opacity-[0.15] transition-opacity duration-[400ms] ease-in-out"
      fill="currentColor"
    >
      {/* Cape flowing left */}
      <path
        d="M30 155 Q25 120 35 90 Q30 80 20 70 Q15 55 25 45 L40 50 Q38 60 42 70 L50 65 Q48 55 50 45 Q52 35 55 30"
        className="text-accent"
      />
      {/* Body - heroic standing pose */}
      <path
        d="M55 30 Q58 25 60 20 Q62 15 60 12 Q58 10 56 12 Q54 15 55 18 Q53 20 55 25 L55 30
           Q50 35 48 45 L47 55 Q45 65 48 75 L50 90 Q48 100 47 115 L45 155 L55 155 L58 115 
           Q59 100 60 90 Q61 100 62 115 L65 155 L75 155 L73 115 Q72 100 70 90 L72 75 
           Q75 65 73 55 L72 45 Q70 35 65 30 L60 28 Z"
        className="text-foreground"
      />
      {/* Cape flowing right */}
      <path
        d="M65 30 Q68 35 70 45 Q72 55 70 65 L78 70 Q82 60 80 50 L95 45 Q85 55 90 70 
           Q95 80 85 90 Q95 120 90 155 L75 155 Q78 120 72 90"
        className="text-accent"
      />
      {/* Hair */}
      <path
        d="M52 15 Q55 5 60 3 Q65 5 68 15 Q70 12 72 14 Q70 8 65 2 Q60 0 55 2 Q50 8 48 14 Q50 12 52 15"
        className="text-foreground"
      />
    </svg>
  );
};

export default BatwomanSilhouette;
