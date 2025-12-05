import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import React from "react"

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default PublicLayout
