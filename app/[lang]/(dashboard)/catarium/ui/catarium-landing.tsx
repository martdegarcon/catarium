import Image from "next/image";

interface CatariumLandingProps {
  dict: {
    history: string;
    historyText1: string;
    historyText2: string;
    historyText3: string;
    historyText4: string;
    historyText5: string;
    historyText6: string;
    geography: string;
    geographyText: string;
    politicalStructure: string;
    politicalStructureText1: string;
    politicalStructureText2: string;
    leaders: {
      tinaWilson: string;
      tinaWilsonTitle: string;
      behmanGarun: string;
      behmanGarunTitle: string;
    };
  };
}

export default function CatariumLanding({ dict }: CatariumLandingProps) {
  return (
    <div className="w-full bg-[#F5F1E7] text-gray-900">
      {/* Hero Image */}
      <div className="w-full aspect-[16/9] relative bg-gradient-to-b from-amber-100 to-[#F5F1E7]">
        <Image
          src="/catarium/img/Katarium_start.png"
          alt="Катариум"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* История Section */}
      <section className="container mx-auto px-6 md:px-16 lg:px-32 py-16">
        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-12">
          {dict.history}
        </h2>
        
        <div className="space-y-8 text-2xl md:text-3xl leading-relaxed">
          <p>{dict.historyText1}</p>
          <p>{dict.historyText2}</p>
        </div>
      </section>

      {/* Waterfall Image */}
      <div className="w-full aspect-[16/9] relative">
        <Image
          src="/catarium/img/Waterfall.png"
          alt="Водопад"
          fill
          className="object-cover"
        />
      </div>

      {/* История continued */}
      <section className="container mx-auto px-6 md:px-16 lg:px-32 py-16">
        <p className="text-2xl md:text-3xl leading-relaxed mb-12">
          {dict.historyText3}
        </p>

        <div className="flex items-center gap-8 my-16">
          <hr className="w-1/4 border-t-2 border-gray-400" />
          <p className="text-2xl md:text-3xl text-[#B64D4A] italic text-center flex-1">
            {dict.historyText4}
          </p>
          <hr className="w-1/4 border-t-2 border-gray-400" />
        </div>

        <div className="space-y-8 text-2xl md:text-3xl leading-relaxed">
          <p>{dict.historyText5}</p>
          <p>{dict.historyText6}</p>
        </div>
      </section>

      {/* География Section */}
      <section className="container mx-auto px-6 md:px-16 lg:px-32 py-16">
        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-12">
          {dict.geography}
        </h2>

        {/* Map Image */}
        <div className="w-full aspect-[16/9] relative my-12 rounded-lg overflow-hidden shadow-2xl">
          <Image
            src="/catarium/img/Map.png"
            alt="Карта"
            fill
            className="object-cover"
          />
        </div>

        <p className="text-2xl md:text-3xl leading-relaxed">
          {dict.geographyText}
        </p>
      </section>

      {/* Политическое устройство Section */}
      <section className="container mx-auto px-6 md:px-16 lg:px-32 py-16">
        <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-12">
          {dict.politicalStructure}
        </h2>

        <div className="space-y-8 text-2xl md:text-3xl leading-relaxed text-center mb-16">
          <p>{dict.politicalStructureText1}</p>
          <p>{dict.politicalStructureText2}</p>
        </div>

        {/* Leaders Section */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Tina Wilson */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-[3/4] relative rounded-lg overflow-hidden shadow-xl mb-8">
              <Image
                src="/catarium/img/Tina.png"
                alt={dict.leaders.tinaWilson}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-3xl md:text-4xl font-semibold mb-2">
              {dict.leaders.tinaWilson}
            </h3>
            <p className="text-2xl md:text-3xl text-gray-600">
              {dict.leaders.tinaWilsonTitle}
            </p>
          </div>

          {/* Behman Garun */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-[3/4] relative rounded-lg overflow-hidden shadow-xl mb-8">
              <Image
                src="/catarium/img/Behman.png"
                alt={dict.leaders.behmanGarun}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-3xl md:text-4xl font-semibold mb-2">
              {dict.leaders.behmanGarun}
            </h3>
            <p className="text-2xl md:text-3xl text-gray-600">
              {dict.leaders.behmanGarunTitle}
            </p>
          </div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="h-24"></div>
    </div>
  );
}

