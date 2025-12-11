import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Renders a spinning loader SVG with accessible status attributes.
 *
 * @param className - Additional CSS classes appended to the default "size-4 animate-spin"
 * @param props - Additional SVG props forwarded to the underlying icon
 * @returns The loader icon element with `role="status"`, `aria-label="Loading"`, and composed classes
 */
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }