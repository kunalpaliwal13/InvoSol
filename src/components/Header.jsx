import React from "react";


const Header = () => (
  <header className="flex items-center justify-between px-10 py-7 bg-black text-white shadow-md">
    <div className="text-4xl font-semibold">InvoSol</div>
    <nav className="flex gap-6 items-center">
      <a href="/" className="text-xl font-semibold">Home</a>
      <a href="/" className="text-xl font-semibold">Contact Us</a>
      <a href="/" className="text-xl font-semibold">Blogs</a>
      {/* <button variant="outline" className="py-1 px-4 mx-10 font-semibold rounded-[6px] text-lg bg-[#70798c72] hover:bg-[#70798caa]">Login</button> */}
    </nav>
  </header>
);

export default Header;