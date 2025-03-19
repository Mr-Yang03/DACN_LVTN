"use client"

import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PasswordInput({ id, value, onChange, show, toggleShow, placeholder }: any) {
    return (
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl focus-visible:outline-none focus-visible:ring-0 focus:ring-0 focus:ring-offset-0"
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-3 top-3 text-slate-400 hover:text-blue-600"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    )
  }

export {PasswordInput};