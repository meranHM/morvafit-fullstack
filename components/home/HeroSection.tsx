import LightRays from "@/components/LightRays"

const HeroSection = () => {
  return (
    <div style={{ width: "100%", height: "600px", position: "relative" }}>
      <LightRays
        raysOrigin="left"
        //raysColor="#3a8ef6"
        //raysColor="#b6ff3f"
        //raysColor="#ff7a31"
        //raysColor="#ffb5c8"
        //raysColor="#c3b8ff"
        //raysColor="#e7f2ff"
        //raysColor="#ffffff"
        //raysColor="#d6d6d6"
        raysColor="f7d387"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.03}
        distortion={0.05}
        className="custom-rays bg-background"
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full max-w-7xl mx-auto">
        <div className="flex-1" />
        <h1 className="flex-1 justify-self-center text-5xl font-medium">
          Minimal. Powerful. Intentional.
        </h1>
        <div className="w-full flex items-center justify-between p-4">
          <p className="max-w-sm text-pretty font-medium">
            At Blanca, we're not about flash. We're about the game. Our equipment is designed to be
            functional and cool but doesn't need to shout. We're for the players who prefer style in
            subtlety, and we're bringing an accessible lineup that doesn't compromise on quality.
          </p>
          <button className="bg-[#f2d953] rounded-lg p-4 hover:bg-white">Our Products</button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
