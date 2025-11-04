"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ExternalLink, ArrowLeft } from "lucide-react";
import { componentsByCategory } from "@/lib/components-data";

// Flatten for search
const allComponents = Object.entries(componentsByCategory).flatMap(([category, components]) =>
  components.map(comp => ({ ...comp, category }))
);

const categories = Object.keys(componentsByCategory);

export default function ComponentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredData = searchQuery
    ? allComponents.filter((component) =>
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : selectedCategory === "All"
    ? componentsByCategory
    : { [selectedCategory]: componentsByCategory[selectedCategory as keyof typeof componentsByCategory] };

  const displayAsFlat = searchQuery !== "";

  return (
    <main className="container max-w-7xl py-12 mx-auto px-4">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Button variant="ghost" asChild className="mb-4 -ml-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <h1 className="text-4xl font-bold mb-2">Components</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Browse {allComponents.length} production-ready Better Auth components
          </p>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filters */}
          {!searchQuery && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "All" ? "default" : "secondary"}
                onClick={() => setSelectedCategory("All")}
                size="sm"
              >
                All ({allComponents.length})
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category} ({componentsByCategory[category as keyof typeof componentsByCategory].length})
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Components Table */}
        {displayAsFlat ? (
          // Search results - flat list
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4">Component</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(filteredData as typeof allComponents).map((component) => (
                  <TableRow key={component.slug} className="group">
                    <TableCell>
                      <Link
                        href={`/example/${component.slug}`}
                        className="font-mono text-sm font-medium hover:text-primary transition-colors inline-flex items-center gap-1.5"
                      >
                        {component.name}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {component.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {component.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          // Category sections
          <div className="space-y-8">
            {Object.entries(filteredData as typeof componentsByCategory).map(([category, components]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-xl font-semibold">{category}</h2>
                  <Badge variant="secondary">{components.length}</Badge>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">Component</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {components.map((component) => (
                        <TableRow key={component.slug} className="group">
                          <TableCell>
                            <Link
                              href={`/example/${component.slug}`}
                              className="font-mono text-sm font-medium hover:text-primary transition-colors inline-flex items-center gap-1.5"
                            >
                              {component.name}
                              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {component.description}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {displayAsFlat && (filteredData as typeof allComponents).length === 0 && (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">
              No components found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
