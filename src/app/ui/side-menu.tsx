'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { User, FileText, Calendar, Menu, ChevronLeft, ChevronRight, Settings, MessageSquare, BarChart2, Briefcase } from 'lucide-react'

const menuItems = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Evaluations', href: '/evaluations', icon: FileText },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
]

type SidebarState = 'collapsed' | 'expanded'

export function Sidebar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const [sidebarState, setSidebarState] = useState<SidebarState>('expanded')

    const toggleSidebar = () => {
        setSidebarState(current => current === 'expanded' ? 'collapsed' : 'expanded')
    }

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 lg:hidden">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                    <ScrollArea className="h-[calc(100vh-4rem)]">
                        <nav className="flex flex-col space-y-2 p-4">
                            {menuItems.map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant={pathname === item.href ? "secondary" : "ghost"}
                                        className="w-full justify-start"
                                        onClick={() => setOpen(false)}
                                    >
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.name}
                                    </Button>
                                </Link>
                            ))}
                        </nav>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
            <aside className={cn(
                "hidden lg:flex sticky top-0 z-30 h-screen flex-col transition-all duration-300",
                sidebarState === 'collapsed' ? "w-[60px]" : "w-[240px]"
            )}>
                <ScrollArea className="flex-1">
                    <nav className="flex flex-col space-y-2 p-4">
                        {menuItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={pathname === item.href ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start",
                                        sidebarState === 'collapsed' && "justify-center px-2"
                                    )}
                                >
                                    <item.icon className={cn("h-4 w-4", sidebarState === 'expanded' && "mr-2")} />
                                    {sidebarState === 'expanded' && <span>{item.name}</span>}
                                </Button>
                            </Link>
                        ))}
                    </nav>
                </ScrollArea>
                <div className="hidden lg:block p-2 border-t">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center"
                        onClick={toggleSidebar}
                    >
                        {sidebarState === 'expanded' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        {sidebarState === 'expanded' && <span className="ml-2">Collapse</span>}
                    </Button>
                </div>
            </aside>
        </>
    )
}