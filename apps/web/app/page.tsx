"use client"

import { CTASection, HeroSection, HowItWorks, PricingSection } from "@/@comp"
import FeaturesSection from "@/@comp/featuresSection"


const page = () => {

  return (
    <div className="bg-(--sec-bg) text-white">
      {/* hero section */}
      <HeroSection/>

      {/* demo video section */}
      <div className="p-10 px-15 my-10">
        <div className="h-150 bg-[#63F7A8] rounded-(--custom-radius)">

        </div>
      </div>

      {/* problem Section */}
      <div className="max-w-7xl mx-auto my-10 py-10">
        <h2 className="text-3xl w-7/10">
          AI doesn’t fail — prompts do. AI models are incredibly powerful, but they rely entirely on how you communicate with them.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          <div className="bg-[#282727] p-5 rounded-(--radius) min-h-55 grid">
            <div className="flex justify-between">
              <p>70% increase in <br /> sales leads</p>
              <div>
                <img src="/assets/img/logo.webp" className="h-auto w-10" alt="" />
              </div>
            </div>
            <span className="text-6xl mt-auto">70%</span>
          </div>
          <div className="bg-[#282727] p-5 rounded-(--radius) min-h-55 grid">
            <div className="flex justify-between">
              <p>70% increase in <br /> sales leads</p>
              <div>
                <img src="/assets/img/logo.webp" className="h-auto w-10" alt="" />
              </div>
            </div>
            <span className="text-6xl mt-auto">70%</span>
          </div>
          <div className="bg-[#282727] p-5 rounded-(--radius) min-h-55 grid">
            <div className="flex justify-between">
              <p>70% increase in <br /> sales leads</p>
              <div>
                <img src="/assets/img/logo.webp" className="h-auto w-10" alt="" />
              </div>
            </div>
            <span className="text-6xl mt-auto">70%</span>
          </div>
        </div>

      </div>

      {/* Solution Section */}
      <div className="grid gap-10 grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto my-10 py-10">
        <div className="flex flex-col">
          <h1 className="text-5xl">One Tool. Perfect Prompts. Every Time.</h1>
          <h2 className="text-lg mt-3 text-gray-400">
            Describe your idea once, and our AI-powered engine turns it into optimized prompts for ChatGPT, Gemini, and more — instantly.
          </h2>
          <div className="mt-auto">
            <p className="text-lg">Just describe what you want. Our system analyzes your intent and generates optimized prompts tailored for each AI model. Get high-quality results in seconds without any guesswork.</p>
            <button type="submit" className="mb-4 px-30 mt-3 py-3 rounded-(--radius) font-semibold text-sm
          bg-[#00FF88] text-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"> Signup for free</button>
            <p className="text-gray-400 text-xs mt-2">By signing up, I agree to Terms and Privacy Policy.</p>
          </div>
        </div>
        <div>
          <img src="/assets/img/girlpic.webp" className="h-auto w-full rounded-(--radius)" alt="" />
        </div>
      </div>

      {/* How It Works section */}
      <HowItWorks />

      {/* featues section */}
      <FeaturesSection/>

      {/* pricing section */}
      <PricingSection/>

      {/* CTA Section */}
      <CTASection/>

    </div>
  )
}

export default page