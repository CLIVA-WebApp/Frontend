import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#1D567C] to-[#37B7BE] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-32 h-32 border-4 border-[#37B7BE] rotate-45"></div>
          <div className="absolute top-32 right-32 w-24 h-24 border-2 border-[#37B7BE] rounded-full"></div>
          <div className="absolute bottom-20 left-1/3 w-16 h-16 border-2 border-[#37B7BE]"></div>

          {/* Medical Cross */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-40 h-40">
              <div
                className="absolute inset-0 bg-[#37B7BE] opacity-30"
                style={{
                  clipPath:
                    "polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)",
                }}
              ></div>
              <div
                className="absolute inset-2 border-2 border-[#37B7BE] opacity-50"
                style={{
                  clipPath:
                    "polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)",
                }}
              ></div>
            </div>
          </div>

          {/* Stethoscope shape */}
          <div className="absolute top-20 right-20 w-32 h-32">
            <div className="w-8 h-8 border-4 border-[#37B7BE] rounded-full opacity-40"></div>
            <div className="w-6 h-6 border-2 border-[#37B7BE] rounded-full mt-2 ml-1 opacity-40"></div>
            <div className="w-1 h-20 bg-[#37B7BE] ml-3 opacity-40"></div>
          </div>

          {/* Network connections */}
          <div className="absolute inset-0">
            <svg className="w-full h-full opacity-20" viewBox="0 0 800 400">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#37B7BE" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <circle cx="100" cy="100" r="3" fill="#37B7BE" />
              <circle cx="200" cy="150" r="3" fill="#37B7BE" />
              <circle cx="300" cy="80" r="3" fill="#37B7BE" />
              <circle cx="500" cy="200" r="3" fill="#37B7BE" />
              <circle cx="600" cy="120" r="3" fill="#37B7BE" />
              <line x1="100" y1="100" x2="200" y2="150" stroke="#37B7BE" strokeWidth="1" />
              <line x1="200" y1="150" x2="300" y2="80" stroke="#37B7BE" strokeWidth="1" />
              <line x1="300" y1="80" x2="500" y2="200" stroke="#37B7BE" strokeWidth="1" />
              <line x1="500" y1="200" x2="600" y2="120" stroke="#37B7BE" strokeWidth="1" />
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-6xl font-bold text-white">About Us</h1>
        </div>
      </section>

      {/* About Our Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                About
                <br />
                Our Team
              </h2>
            </div>

            <Card className="bg-white border-2 border-gray-200">
              <CardContent className="p-8">
                <p className="text-gray-700 mb-6">
                  Cliva (Clinical Services Evaluation WebApp) is a digital platform designed to make invisible
                  healthcare gaps visible, helping local governments, public health planners, and NGOs improve access to
                  care where it's needed most.
                </p>
                <p className="text-gray-700">
                  We are a multidisciplinary team of web developers and designer committed to transforming complex
                  health data into clear, actionable insights.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Missions Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Missions</h2>

          <blockquote className="text-2xl italic text-[#1D567C] max-w-4xl mx-auto leading-relaxed">
            "To empower public health stakeholders with tools that make healthcare planning more equitable, data-driven,
            and transparent, ensuring no community is left behind."
          </blockquote>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-16 bg-gradient-to-b from-[#37B7BE] to-[#1D567C] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Meet Our Team</h2>

          <div className="relative">
            {/* Team Member 1 - Evelyn */}
            <div className="flex justify-start mb-12">
              <div className="flex items-center gap-6 max-w-md">
                <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/team/evelyn.png"
                    alt="Evelyn Yosiana"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Card className="bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold text-gray-900">Evelyn Yosiana</h3>
                    <p className="text-gray-600">Computer Science, ITB</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Team Member 2 - Dama */}
            <div className="flex justify-end mb-12">
              <div className="flex items-center gap-6 max-w-md flex-row-reverse">
                <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/team/dama.png"
                    alt="Dama Dhananjaya Daliman"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Card className="bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-4 text-right">
                    <h3 className="text-xl font-bold text-gray-900">Dama Dhananjaya Daliman</h3>
                    <p className="text-gray-600">Information System, ITB</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Team Member 3 - Maximilian */}
            <div className="flex justify-start">
              <div className="flex items-center gap-6 max-w-md">
                <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/team/maximilian.png"
                    alt="Maximilian Sulistiyo"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Card className="bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold text-gray-900">Maximilian Sulistiyo</h3>
                    <p className="text-gray-600">Computer Science, ITB</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
