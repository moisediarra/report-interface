import SearchForm from "@/components/search-form"
import { ResultsTable } from "@/components/results-table"
import SummaryUsageReport from "@/components/search-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Reporting</h1>
          <p className="text-muted-foreground">Search and analyse your usage reports.</p>
        </div>

        {/* Content Container */}
        <div className="space-y-6">
          {/* Search Form */}
          {/* <SearchForm /> */}
          
          {/* Results Table */}
          <SummaryUsageReport />
          {/* <ResultsTable /> */}
        </div>
      </div>
    </main>
  )
}
