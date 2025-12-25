import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { Bell } from "lucide-react"

interface DashboardHeaderProps {
  name: string
  plan: string
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ name = "User", plan }) => {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              className="object-contain h-25 w-auto"
              width={250}
              height={100}
              src="/morvafit-logo-black.svg"
              alt="Morvafit Logo"
            />
          </Link>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all duration-300">
              <Bell size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{name}</p>
                <p className="text-xs text-gray-500">{plan} Plan</p>
              </div>
              <div className="relative group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                  SJ
                </div>
                <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
