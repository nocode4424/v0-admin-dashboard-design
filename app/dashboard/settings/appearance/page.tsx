"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ColorPicker } from "@/components/dashboard/color-picker"

export default function AppearancePage() {
  const { toast } = useToast()
  const [primaryColor, setPrimaryColor] = useState("#0f172a")
  const [secondaryColor, setSecondaryColor] = useState("#6366f1")
  const [accentColor, setAccentColor] = useState("#f43f5e")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [cardColor, setCardColor] = useState("#f8fafc")
  const [textColor, setTextColor] = useState("#0f172a")

  const handleSave = () => {
    // In a real app, this would save to the database
    toast({
      title: "Appearance settings saved",
      description: "Your customizations have been applied.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appearance</h1>
        <p className="text-muted-foreground">Customize the look and feel of your restaurant ordering system.</p>
      </div>

      <Tabs defaultValue="colors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>Customize the colors used throughout your restaurant ordering system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <ColorPicker id="primary-color" color={primaryColor} onChange={setPrimaryColor} />
                    <Input value={primaryColor} readOnly />
                  </div>
                  <p className="text-xs text-muted-foreground">Used for main buttons and important UI elements.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <ColorPicker id="secondary-color" color={secondaryColor} onChange={setSecondaryColor} />
                    <Input value={secondaryColor} readOnly />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Used for secondary buttons and less important UI elements.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <ColorPicker id="accent-color" color={accentColor} onChange={setAccentColor} />
                    <Input value={accentColor} readOnly />
                  </div>
                  <p className="text-xs text-muted-foreground">Used for highlights and special elements.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="background-color">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <ColorPicker id="background-color" color={backgroundColor} onChange={setBackgroundColor} />
                    <Input value={backgroundColor} readOnly />
                  </div>
                  <p className="text-xs text-muted-foreground">The main background color of the application.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-color">Card/Container Color</Label>
                  <div className="flex items-center gap-2">
                    <ColorPicker id="card-color" color={cardColor} onChange={setCardColor} />
                    <Input value={cardColor} readOnly />
                  </div>
                  <p className="text-xs text-muted-foreground">Used for cards, modals, and other container elements.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex items-center gap-2">
                    <ColorPicker id="text-color" color={textColor} onChange={setTextColor} />
                    <Input value={textColor} readOnly />
                  </div>
                  <p className="text-xs text-muted-foreground">The main text color used throughout the application.</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4 text-lg font-medium">Preview</h3>
                <div className="rounded-lg border p-6" style={{ backgroundColor }}>
                  <div className="rounded-lg p-6" style={{ backgroundColor: cardColor }}>
                    <h4 className="mb-2 text-lg font-medium" style={{ color: textColor }}>
                      Sample Card
                    </h4>
                    <p className="mb-4 text-sm" style={{ color: textColor }}>
                      This is a preview of how your color scheme will look.
                    </p>
                    <div className="flex gap-2">
                      <button className="rounded px-4 py-2 text-white" style={{ backgroundColor: primaryColor }}>
                        Primary Button
                      </button>
                      <button className="rounded px-4 py-2 text-white" style={{ backgroundColor: secondaryColor }}>
                        Secondary Button
                      </button>
                      <button className="rounded px-4 py-2 text-white" style={{ backgroundColor: accentColor }}>
                        Accent Button
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
