"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ResultItem {
  productDesc: string
  searchCount: number
}

export function ResultsTable() {
  const [currentPage, setCurrentPage] = useState(1)

  // Mock data - in production, this would come from API
  const mockData: ResultItem[] = [
    { productDesc: "Commercial Detailed Credit", searchCount: 96 },
    { productDesc: "Personal Loan Analysis", searchCount: 234 },
    { productDesc: "Business Account Summary", searchCount: 156 },
    { productDesc: "Transaction Report", searchCount: 89 },
    { productDesc: "TOTAL", searchCount: 575 },
  ]

  const pageSize = 10
  const totalRecords = 668266
  const totalPages = Math.ceil(totalRecords / pageSize)

  return (
    <Card className="border border-border bg-card overflow-hidden">
      {/* Results Header */}
      <div className="border-b border-border bg-secondary/50 px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground">Results.</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Total: <span className="font-medium">{totalRecords.toLocaleString("fr-FR")}</span> records
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground">
                Product description
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-foreground">
                Number of searches
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockData.map((item, index) => (
              <tr
                key={index}
                className={`transition-colors ${
                  item.productDesc === "TOTAL" ? "bg-primary/10 font-semibold" : "hover:bg-muted/50"
                }`}
              >
                <td className="px-6 py-4 text-sm text-foreground">{item.productDesc}</td>
                <td className="px-6 py-4 text-right text-sm font-medium text-foreground">{item.searchCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page <span className="font-medium">{currentPage}</span> on <span className="font-medium">{totalPages}</span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <select
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="px-3 py-1 rounded-md border border-border bg-background text-sm text-foreground"
          >
            {Array.from({ length: Math.min(10, totalPages) }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                Page {page}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
