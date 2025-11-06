"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ExternalLink, ArrowLeft } from "lucide-react";
import { componentsByCategory } from "@/lib/components-data";
import { cn } from "@/lib/utils";

// Flatten for search
const allComponents = Object.entries(componentsByCategory).flatMap(([category, components]) =>
  components.map(comp => ({ ...comp, category }))
);

const categories = Object.keys(componentsByCategory);

export default function ComponentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredComponents = searchQuery
    ? allComponents.filter((component) =>
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : selectedCategory
    ? allComponents.filter((comp) => comp.category === selectedCategory)
    : allComponents;

  const displayedCategories = searchQuery || selectedCategory
    ? categories.filter((cat) => 
        filteredComponents.some((comp) => comp.category === cat)
      )
    : categories;

  return (
    <main className="container max-w-7xl py-12 mx-auto px-4">
      <div className="flex gap-8">
        {/* Sidebar Navigation */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-24 space-y-4">
            <div>
              <Button variant="ghost" asChild className="mb-4 -ml-4">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to home
                </Link>
              </Button>
              <h2 className="font-semibold mb-2">Categories</h2>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent",
                  selectedCategory === null && !searchQuery && "bg-accent font-medium"
                )}
              >
                All Components
                <span className="ml-auto text-xs text-muted-foreground float-right">
                  {allComponents.length}
                </span>
              </button>
              
              {categories.map((category) => {
                const count = componentsByCategory[category as keyof typeof componentsByCategory].length;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent",
                      selectedCategory === category && "bg-accent font-medium"
                    )}
                  >
                    {category}
                    <span className="ml-auto text-xs text-muted-foreground float-right">
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div>
            <Button variant="ghost" asChild className="mb-4 -ml-4 md:hidden">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to home
              </Link>
            </Button>
            <h1 className="text-4xl font-bold mb-2">
              {selectedCategory || "All Components"}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {selectedCategory 
                ? `Browse ${componentsByCategory[selectedCategory as keyof typeof componentsByCategory].length} ${selectedCategory.toLowerCase()} components`
                : `Browse ${allComponents.length} production-ready Better Auth components`
              }
            </p>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Mobile Category Filter */}
            <div className="md:hidden mt-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "secondary"}
                  onClick={() => setSelectedCategory(null)}
                  size="sm"
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    onClick={() => setSelectedCategory(category)}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Components Grid */}
          {searchQuery && filteredComponents.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Found {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredComponents.map((component) => (
              <Link
                key={component.slug}
                href={`/example/${component.slug}`}
                className="group"
              >
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-base font-mono group-hover:text-primary transition-colors">
                        {component.name}
                      </CardTitle>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                    <CardDescription className="text-sm">
                      {component.description}
                    </CardDescription>
                    {searchQuery && (
                      <Badge variant="outline" className="text-xs w-fit mt-2">
                        {component.category}
                      </Badge>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          {/* No Results */}
          {filteredComponents.length === 0 && (
            <Card className="py-12">
              <CardHeader className="text-center">
                <CardTitle className="text-muted-foreground font-normal">
                  No components found matching &quot;{searchQuery}&quot;
                </CardTitle>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
