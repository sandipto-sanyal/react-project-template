import { Button } from "@/components/ui/button"
import { toast, Toaster } from "@/components/ui/toast"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const items = [
  { label: "Select Database", value: "" },
  { label: "Employees", value: "employees" },
  { label: "Finance", value: "finance" }
]
export default function Home() {
  const [itemChosen, setItemChosen] = useState<string>("")

  function renderItemsDropdown() {
    return (
    <Select  items={items} onValueChange={(e) => { setItemChosen(e as string) }} defaultValue={items[0].value}>
      <SelectTrigger className="h-9 w-44 shrink-0 border-0 bg-transparent px-3 shadow-none data-[size=default]:h-9 focus-visible:ring-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Databases</SelectLabel>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>)
  }
  return (
    <>
      <div className="p-8">
        <h1 className="text-3xl font-bold underline text-brand-secondary">Home Page</h1>
        <p>Welcome to the homepage of our React + Flask application.</p>
        <Button variant="outline" onClick={() =>
          toast.add({
            type: "info",
            description: "Arrive 10 minutes before the event.",
          })
        }>
          Show Toast
        </Button>
        {renderItemsDropdown()}
        <p>{`You have selected ${itemChosen}`}</p>
      </div>
      <Toaster />
    </>
  );
}