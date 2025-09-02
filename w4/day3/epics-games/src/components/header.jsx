export function Header() {
  return (
    <header className="bg-[rgba(49,49,49,1)]">
      <div className="mx-auto  text-xs">
        <div className="flex items-center justify-between ">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 pl-4">
              <img src="/logo.svg" alt="Logo" className="w-7 h-9" />
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-300 hover:text-red-400">
                STORE
              </a>
              <a href="#" className="text-gray-300 hover:text-red-400">
                FAQ
              </a>
              <a href="#" className="text-gray-300 hover:text-red-400">
                HELP
              </a>
              <a href="#" className="text-gray-300 hover:text-red-400">
                UNREAL ENGINE
              </a>
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <div className="  hover:text-white cursor-pointer">
              <img src="/globe.svg" alt="Logo" className="w-7 h-9" />
            </div>

            <div className="text-gray-300 flex items-center hover:text-white cursor-pointer space-x-2">
              <img src="/Frame.svg" alt="Logo" className="w-7 h-9" />
              <p className=" inline-block text-xs">SIGN IN</p>
            </div>

            <div className="text-sm bg-[#007AFF] hover:bg-blue-700 text-white px-5 py-3 cursor-pointer">
              <p>DOWNLOAD</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
