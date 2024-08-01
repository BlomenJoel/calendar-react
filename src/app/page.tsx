"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button"

function Wrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <main className="flex min-h-screen flex-col items-center justify-between p-24 ">
    {children}
  </main>
}

export default function Home() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Wrapper><h2>Loading</h2></Wrapper>
  }

  if (!session) {
    const handleLogin = () => {
      signIn()
    }
    return <Wrapper>
      <div>
        <h1>Welcome</h1>
        <a href="signup">signup</a>
        <h2>or</h2>
        <Button.Primary title="Sign in" onClick={handleLogin} />
      </div>
    </Wrapper>
  }

  const handleClick = () => {
    signOut()
  }

  return (
    <Wrapper>
      <div>
        <h1>Welcome</h1>
        <a href="calendar">Check out calendar</a>
        <div className="block">

          <Button.Primary onClick={handleClick} title="Logout" ></Button.Primary>
        </div>
      </div>
    </Wrapper>
  );
}
