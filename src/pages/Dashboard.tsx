import { Button } from "@/components/ui/button.tsx";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"

import { Toaster, toast } from "@/components/ui/toast";

import  api  from "@/src/lib/http/client"




const items = [
  { label: "Select a database", value: null },
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
  { label: "Pineapple", value: "pineapple" },
]



type TestApiResponse = {
  message: String
}


export default function Dashboard() {
  const [username, setUsername] = useState<string | null>(null);
  const [database, setDatabase] = useState<string | null>(null);
  const [testApiResponse, setTestApiResponse] = useState<TestApiResponse>({message:""})

  function SelectDatabase() {
    return (
      <div>
        <Label htmlFor="selectDatabase" className="mb-3">Select a Database</Label>
        <Select items={items} id="selectDatabase" onValueChange={(e)=>{setDatabase(e as string)}}>
          <SelectTrigger className="w-full max-w-48">
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
        </Select>
      </div>
    )
  }

  function InputField() {
    return (
      <Field className="w-50">
        <FieldLabel htmlFor="input-field-username">Username</FieldLabel>
        <Input
          id="input-field-username"
          type="text"
          placeholder="Enter your username"
          onChange={(e)=>{setUsername(e.currentTarget.value as string)}}
        />
        <FieldDescription>
          Choose a unique username for your account.
        </FieldDescription>
      </Field>
    )
  }

  async function sendForm() {
    const response = await api.post(
      "/api/test",
      {"username":username, "database":database},

    )
    if (response.status === 200) {
      setTestApiResponse(response.data)
    }
  }

  function buttonClickCallback(e:MouseEvent) {
    
    if (username === null) {
      toast.add({
        "description":"Username must be provided",
        "type":"Error",

      })
      return
    }
    else if (database === null) {
      toast.add({
        "description":"Database must be provided",
        "type":"Error",

      })
      return
    }
    else {
      toast.add({
        "description":`Submitting form with Username:${username} and Database${database}`,
        "type":"info",
      })
      sendForm()
    }
    ;
  }
  return (
    <div className="p-8">
      <div>
        <h1 className="text-brand-primary">API Testing Field</h1>
        <div className="flex justify-around">
          {InputField()}
          {SelectDatabase()}
        </div>
        <div className="flex justify-center">
          <Button className="w-50" variant="outline" size="icon" aria-label="Submit" 
            onClick={(e)=>{buttonClickCallback(e)}}
          >
            <div className="flex justify-around">
              <p>Send</p>
              <Send />
            </div>
          </Button>
        </div>
      </div>
      <div>
        <h1>Test API Response</h1>
        <pre>{JSON.stringify(testApiResponse, null, 2)}</pre>
      </div>
      <div className="hidden">
        <pre>{JSON.stringify(username, null, 2)}</pre>
      </div>
      <Toaster />
    </div>
  );
}