"use client"

import { useState } from "react"
import { Beer } from "./beer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const beerData = {
  ipas: [
    {
      name: "Hoppy Trails",
      type: "West Coast IPA",
      abv: 7.2,
      ibu: 65,
      color: "#e3a008",
      description: "A classic West Coast IPA with bold pine and citrus hop character.",
    },
    {
      name: "Hazy Dayz",
      type: "New England IPA",
      abv: 6.8,
      ibu: 45,
      color: "#fbbf24",
      description: "Juicy and hazy with notes of tropical fruit and low bitterness.",
    },
    {
      name: "Double Vision",
      type: "Double IPA",
      abv: 8.5,
      ibu: 85,
      color: "#d97706",
      description: "A powerful double IPA with intense hop aroma and flavor.",
    },
    {
      name: "Session Surfer",
      type: "Session IPA",
      abv: 4.5,
      ibu: 40,
      color: "#fcd34d",
      description: "All the hop flavor with lower alcohol for extended enjoyment.",
    },
    {
      name: "Citrus Squeeze",
      type: "Citrus IPA",
      abv: 6.5,
      ibu: 55,
      color: "#fbbf24",
      description: "Bright and refreshing with added citrus zest for extra zing.",
    },
  ],
  stouts: [
    {
      name: "Midnight Oil",
      type: "Imperial Stout",
      abv: 9.2,
      ibu: 70,
      color: "#1e1b16",
      description: "Rich, dark, and complex with notes of chocolate and coffee.",
    },
    {
      name: "Breakfast Blend",
      type: "Coffee Stout",
      abv: 6.5,
      ibu: 35,
      color: "#292524",
      description: "Smooth stout infused with locally roasted coffee beans.",
    },
    {
      name: "Coconut Paradise",
      type: "Coconut Stout",
      abv: 7.0,
      ibu: 30,
      color: "#1c1917",
      description: "Tropical twist on a classic stout with toasted coconut.",
    },
    {
      name: "Vanilla Dream",
      type: "Vanilla Stout",
      abv: 6.8,
      ibu: 32,
      color: "#292524",
      description: "Creamy stout with Madagascar vanilla beans for a smooth finish.",
    },
    {
      name: "Oatmeal Cookie",
      type: "Oatmeal Stout",
      abv: 5.8,
      ibu: 28,
      color: "#44403c",
      description: "Silky smooth with oats and a hint of cinnamon and raisin.",
    },
  ],
  lagers: [
    {
      name: "Classic Pilsner",
      type: "German Pilsner",
      abv: 5.0,
      ibu: 35,
      color: "#fef3c7",
      description: "Crisp, clean German-style pilsner with noble hop character.",
    },
    {
      name: "Vienna Sunset",
      type: "Vienna Lager",
      abv: 5.2,
      ibu: 25,
      color: "#b45309",
      description: "Amber lager with toasty malt flavor and clean finish.",
    },
    {
      name: "Oktoberfest",
      type: "Märzen",
      abv: 5.8,
      ibu: 22,
      color: "#92400e",
      description: "Traditional Bavarian-style festbier with rich malt character.",
    },
    {
      name: "Czech Mate",
      type: "Czech Pilsner",
      abv: 4.8,
      ibu: 40,
      color: "#fef3c7",
      description: "Bohemian-style pilsner with spicy Saaz hop aroma.",
    },
    {
      name: "Mexican Lager",
      type: "Mexican Lager",
      abv: 4.5,
      ibu: 18,
      color: "#fef9c3",
      description: "Light and refreshing with a hint of corn sweetness.",
    },
  ],
  sours: [
    {
      name: "Berry Blast",
      type: "Berry Sour",
      abv: 5.5,
      ibu: 10,
      color: "#be185d",
      description: "Tart and fruity with a blend of raspberries, blackberries, and blueberries.",
    },
    {
      name: "Pucker Up",
      type: "Berliner Weisse",
      abv: 3.8,
      ibu: 8,
      color: "#fef9c3",
      description: "Traditional German-style sour wheat beer, light and refreshing.",
    },
    {
      name: "Tropical Tart",
      type: "Tropical Sour",
      abv: 6.0,
      ibu: 12,
      color: "#fbbf24",
      description: "Sour ale with passion fruit, mango, and pineapple.",
    },
    {
      name: "Cherry Bomb",
      type: "Cherry Sour",
      abv: 5.2,
      ibu: 10,
      color: "#be123c",
      description: "Tart cherry sour with a perfect balance of sweetness and acidity.",
    },
    {
      name: "Cucumber Cooler",
      type: "Cucumber Gose",
      abv: 4.2,
      ibu: 8,
      color: "#a3e635",
      description: "Refreshing gose with cucumber, salt, and coriander.",
    },
  ],
  wheats: [
    {
      name: "Cloudy Day",
      type: "Hefeweizen",
      abv: 5.2,
      ibu: 15,
      color: "#fef3c7",
      description: "Traditional German wheat beer with banana and clove notes.",
    },
    {
      name: "Orange Crush",
      type: "Citrus Wheat",
      abv: 5.0,
      ibu: 18,
      color: "#fcd34d",
      description: "Wheat beer with orange peel and a hint of coriander.",
    },
    {
      name: "Summer Haze",
      type: "American Wheat",
      abv: 4.8,
      ibu: 20,
      color: "#fef3c7",
      description: "Clean, crisp American-style wheat beer with a light hop character.",
    },
    {
      name: "Peach Perfect",
      type: "Peach Wheat",
      abv: 5.5,
      ibu: 16,
      color: "#fcd34d",
      description: "Wheat beer infused with juicy peaches for a refreshing twist.",
    },
    {
      name: "Blueberry Bliss",
      type: "Blueberry Wheat",
      abv: 5.3,
      ibu: 15,
      color: "#7e22ce",
      description: "Wheat beer with fresh blueberries for a subtle fruity character.",
    },
  ],
  specialties: [
    {
      name: "Peanut Butter Porter",
      type: "Specialty Porter",
      abv: 6.5,
      ibu: 30,
      color: "#78350f",
      description: "Rich porter with natural peanut butter flavor and chocolate notes.",
    },
    {
      name: "Maple Bourbon Barrel",
      type: "Barrel-Aged Ale",
      abv: 10.2,
      ibu: 25,
      color: "#92400e",
      description: "Strong ale aged in bourbon barrels with maple syrup.",
    },
    {
      name: "Smoked Applewood",
      type: "Smoked Lager",
      abv: 5.5,
      ibu: 22,
      color: "#b45309",
      description: "Lager with a subtle applewood smoke character.",
    },
    {
      name: "Honey Lavender",
      type: "Honey Ale",
      abv: 6.0,
      ibu: 20,
      color: "#fbbf24",
      description: "Golden ale brewed with local honey and a hint of lavender.",
    },
    {
      name: "Pumpkin Spice",
      type: "Pumpkin Ale",
      abv: 6.2,
      ibu: 25,
      color: "#d97706",
      description: "Seasonal ale with real pumpkin and warm autumn spices.",
    },
    {
      name: "Watermelon Wheat",
      type: "Fruit Beer",
      abv: 4.8,
      ibu: 15,
      color: "#fca5a5",
      description: "Refreshing wheat beer with natural watermelon flavor.",
    },
    {
      name: "Chocolate Hazelnut",
      type: "Dessert Stout",
      abv: 7.5,
      ibu: 35,
      color: "#1c1917",
      description: "Decadent stout with chocolate and hazelnut flavors.",
    },
    {
      name: "Jalapeño Cream Ale",
      type: "Spiced Beer",
      abv: 5.3,
      ibu: 18,
      color: "#fef3c7",
      description: "Smooth cream ale with a kick of fresh jalapeños.",
    },
    {
      name: "Rosemary IPA",
      type: "Herb-Infused IPA",
      abv: 6.7,
      ibu: 60,
      color: "#d97706",
      description: "IPA with fresh rosemary for an herbal aromatic twist.",
    },
    {
      name: "S'mores Porter",
      type: "Dessert Porter",
      abv: 7.0,
      ibu: 32,
      color: "#44403c",
      description: "Porter with graham cracker, marshmallow, and chocolate notes.",
    },
  ],
}

export function BeerMenu() {
  const [activeTab, setActiveTab] = useState("ipas")

  return (
    <Tabs defaultValue="ipas" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-8">
        <TabsTrigger value="ipas" className="text-lg">
          IPAs
        </TabsTrigger>
        <TabsTrigger value="stouts" className="text-lg">
          Stouts
        </TabsTrigger>
        <TabsTrigger value="lagers" className="text-lg">
          Lagers
        </TabsTrigger>
        <TabsTrigger value="sours" className="text-lg">
          Sours
        </TabsTrigger>
        <TabsTrigger value="wheats" className="text-lg">
          Wheats
        </TabsTrigger>
        <TabsTrigger value="specialties" className="text-lg">
          Specialties
        </TabsTrigger>
        <TabsTrigger value="all" className="text-lg">
          All 35
        </TabsTrigger>
      </TabsList>

      <TabsContent value="ipas" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beerData.ipas.map((beer, index) => (
            <Beer key={`ipa-${index}`} {...beer} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="stouts" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beerData.stouts.map((beer, index) => (
            <Beer key={`stout-${index}`} {...beer} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="lagers" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beerData.lagers.map((beer, index) => (
            <Beer key={`lager-${index}`} {...beer} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="sours" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beerData.sours.map((beer, index) => (
            <Beer key={`sour-${index}`} {...beer} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="wheats" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beerData.wheats.map((beer, index) => (
            <Beer key={`wheat-${index}`} {...beer} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="specialties" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beerData.specialties.map((beer, index) => (
            <Beer key={`specialty-${index}`} {...beer} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="all" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            ...beerData.ipas,
            ...beerData.stouts,
            ...beerData.lagers,
            ...beerData.sours,
            ...beerData.wheats,
            ...beerData.specialties,
          ].map((beer, index) => (
            <Beer key={`all-${index}`} {...beer} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
