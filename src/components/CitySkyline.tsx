const CitySkyline = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none">
      <svg
        viewBox="0 0 1440 200"
        className="w-full h-auto"
        preserveAspectRatio="none"
        fill="hsl(222, 50%, 4%)"
      >
        {/* Left cluster */}
        <rect x="20" y="140" width="30" height="60" />
        <rect x="55" y="100" width="25" height="100" />
        <rect x="85" y="120" width="35" height="80" />
        <rect x="125" y="80" width="20" height="120" />
        <rect x="150" y="110" width="40" height="90" />
        <rect x="195" y="130" width="25" height="70" />
        
        {/* Left-center */}
        <rect x="250" y="90" width="22" height="110" />
        <rect x="277" y="60" width="30" height="140" />
        <rect x="312" y="100" width="18" height="100" />
        <rect x="335" y="75" width="35" height="125" />
        <rect x="375" y="110" width="25" height="90" />
        
        {/* Center cluster (tallest, behind beam) */}
        <rect x="450" y="50" width="28" height="150" />
        <rect x="483" y="30" width="35" height="170" />
        <rect x="523" y="70" width="22" height="130" />
        <rect x="550" y="45" width="30" height="155" />
        
        {/* Antenna detail */}
        <rect x="498" y="15" width="3" height="15" />
        <rect x="563" y="30" width="3" height="15" />
        
        {/* Center-right */}
        <rect x="620" y="85" width="25" height="115" />
        <rect x="650" y="55" width="32" height="145" />
        <rect x="687" y="95" width="20" height="105" />
        <rect x="712" y="70" width="28" height="130" />
        
        {/* Right-center */}
        <rect x="780" y="100" width="30" height="100" />
        <rect x="815" y="65" width="25" height="135" />
        <rect x="845" y="85" width="35" height="115" />
        <rect x="885" y="110" width="20" height="90" />
        
        {/* Right cluster */}
        <rect x="940" y="75" width="28" height="125" />
        <rect x="973" y="95" width="22" height="105" />
        <rect x="1000" y="55" width="30" height="145" />
        <rect x="1035" y="80" width="25" height="120" />
        <rect x="1065" y="105" width="35" height="95" />
        
        {/* Far right */}
        <rect x="1140" y="90" width="22" height="110" />
        <rect x="1167" y="70" width="30" height="130" />
        <rect x="1202" y="110" width="25" height="90" />
        <rect x="1232" y="85" width="35" height="115" />
        <rect x="1272" y="120" width="20" height="80" />
        <rect x="1300" y="100" width="30" height="100" />
        <rect x="1340" y="130" width="40" height="70" />
        <rect x="1390" y="110" width="30" height="90" />
        
        {/* Ground fill */}
        <rect x="0" y="180" width="1440" height="20" />
      </svg>
    </div>
  );
};

export default CitySkyline;
