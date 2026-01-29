
const page = () => {
  return (
    <div className="bg-(--sec-bg) text-white">
      {/* hero section */}
      <div>
      </div>

      {/* demo video section */}
      <div className="p-10 px-15">
        <div className="h-150 bg-[#63F7A8] rounded-(--custom-radius)">

        </div>
      </div>

      <div className="max-w-7xl mx-auto">
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


    </div>
  )
}

export default page