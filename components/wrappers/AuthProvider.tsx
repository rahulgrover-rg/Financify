"use client";
import {ClerkProvider} from "@clerk/nextjs"

const AuthProvider = ({children} : {children: React.ReactNode}) => {
  return (
    <ClerkProvider>
        {children}
    </ClerkProvider>
  )
}

export default AuthProvider