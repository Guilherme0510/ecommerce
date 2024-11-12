import React from "react";
import { images } from "../assets/assets";

const Banner = () => {
  return (
    <div
      className="h-[50vh] md:h-[70vh] flex flex-col md:flex-row items-center justify-center mx-auto border-2 mt-10 rounded-xl"
      data-aos="fade-down"
      data-aos-duration="700"
    >
      <div
        className="w-full sm:w-1/2 h-1/2 md:h-full flex items-center justify-center py-10 sm:py-0"
        data-aos="fade-right"
        data-aos-duration="700"
        data-aos-delay="700"
      >
        <div className="text-[#6B4423]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#6B4423]"></p>
            <p className="font-medium text-sm md:text-base">
              NOSSOS MAIS VENDIDOS
            </p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            Novidades Deliciosas
          </h1>{" "}
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">COMPRE AGORA</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#6B4423]"></p>
          </div>
        </div>
      </div>

      <div
        className="w-full md:w-1/2 h-1/2 md:h-full"
        data-aos="fade-left"
        data-aos-duration="700"
        data-aos-delay="700"
      >
        <img
          src={images.banner}
          className="w-full h-[25vh] md:h-[70vh] object-cover md:rounded-r-xl rounded-b-xl md:rounded-bl-none rounded-bl-xl"
          alt=""
        />
      </div>
    </div>
  );
};

export default Banner;
