import React from "react";

const Footer = () => {
  return (
    <section>
      <footer className="bg-[rgba(49,49,49,1)] py-8 ">
        <div className="rightLogos flex justify-between  px-3 pr-5 ">
          <div className="flex gap-3">
            <img className="w-6" src="/tw.svg" alt="" />
            <img className="w-6" src="/fb.svg" alt="" />
            <img className="w-6" src="/yt.svg" alt="" />
          </div>
          <div
            className="flex  items-center justify-center border-[2px] cursor-pointer border-white w-8 h-8  "
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img className=" w-3" src="/wa.svg" alt="" />
          </div>
        </div>
        <p className=" px-3 text-[15px] text-[rgba(255,255,255,0.6)] mt-5 ">
          Resources
        </p>
        <div className="text-white text-[15px] flex flex-wrap px-3  leading-7 gap-6">
          {/*  */}
          <div className="mt-1">
            <p>Creator Support</p>
            <p>Published on Epic</p>
            <p>Profession</p>
            <p>company</p>
          </div>
          {/*  */}
          {/*  */}
          <div className="mt-1">
            <p>Fan Works Policy</p>
            <p>User Exp Services</p>
            <p>User License</p>
          </div>
          {/*  */}
          {/*  */}
          <div className="mt-1">
            <p>Online Services</p>
            <p>Community</p>
            <p>Epic News-room</p>
          </div>
          {/*  */}
          {/*  */}
          <div className="mt-1">
            <p>Bottle Breakers</p>
            <p>Fortnite</p>
            <p>Infinity Blade</p>
          </div>
          {/*  */}
          {/*  */}
          <div className="mt-1">
            <p>Robo Recall</p>
            <p>Shadow Complex</p>
            <p>Unreal Tournament</p>
          </div>
          {/*  */}
        </div>
        <div className=" max-w-[850px] mt-10 text-[13px] text-white px-3  ">
          <p>
            © 2022, Epic Games, Inc. All rights reserved. Epic, Epic Games, Epic
            Games logo, Fortnite, Fortnite logo, Unreal, Unreal Engine, Unreal
            Engine logo, Unreal Tournament <code>)</code> and the Unreal
            Tournament logo are trademarks or registered trademarks of Epic
            Games, Inc. in the United States of America and elsewhere. Other
            brand or product names are trademarks of their respective owners.
            Transactions outside the United States are handled through Epic
            Games International, S.à r.l..
          </p>
        </div>
        <div className="mt-7 text-[15px] text-white flex justify-between px-3 pr-5 ">
          <div className="flex gap-3">
            <p>Terms Of Services</p>
            <p>Privacy Policy</p>
            <p>Store Refund Policy</p>
          </div>
          {/* <div className="flex  items-center justify-center border-[2px] border-white w-8 h-8  "> */}
          <img className=" w-5" src="/logo.svg" alt="" />
          {/* </div> */}
        </div>
      </footer>
    </section>
  );
};

export default Footer;
