"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
type Props = {
    color: string
    setColor: (val: string) => void
}

export default function ColorPicker({ color, setColor }: Props) {
    return (
        <div className="flex flex-col items-center space-y-4 p-4 bg-gray-100 rounded-lg shadow-md">
            <div className="w-full max-w-xs">
                <Label htmlFor="colorPicker" className="text-sm font-medium text-gray-700">
                    Choose a color
                </Label>
                <div className="mt-1 flex items-center space-x-2">
                    <Input
                        type="color"
                        id="colorPicker"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-12 h-12 p-1 bg-white border border-gray-300 rounded-md cursor-pointer"
                    />
                    <Input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="flex-grow"
                        placeholder="#000000"
                    />
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <div className="text-sm font-medium text-gray-700">Selected Color:</div>
                <div
                    className="w-6 h-6 border border-gray-300 rounded-md shadow-inner"
                    style={{ backgroundColor: color }}
                ></div>
            </div>
        </div>
    )
}