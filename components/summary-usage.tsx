"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"

// === Types API ===
interface SummaryUsageItem {
  productDesc: string
  searchCount: number
}

interface PaginationDto {
  page: number
  pageSize: number
  totalRecords: number
  totalPages: number
}

interface SummaryUsageResponse {
  startDate: string
  endDate: string
  subscriberName: string
  companyPhysicalAddress1: string
  reportType: string
  pagination: PaginationDto | null
  data: SummaryUsageItem[]
}

export default function SummaryUsageReport() {
  const [formData, setFormData] = useState({
    startDate: "2025-10-01",
    endDate: "2025-10-31",
    subscriberName: "",
    reportType: "summary",
    page: 1,
    pageSize: 10,
  })

  const [report, setReport] = useState<SummaryUsageResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePageChange = (newPage: number) => {
    setFormData((prev) => ({ ...prev, page: newPage }))
    fetchData({ ...formData, page: newPage })
  }

  const fetchData = async (data = formData) => {
    setLoading(true)
    setError(null)

    try {
      const payload = {
        startDate: data.startDate,
        endDate: data.endDate,
        subscriberName: data.subscriberName || null,
        reportType: data.reportType,
        page: data.page,
        pageSize: data.pageSize,
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5186"
      const endpoint = `${apiUrl}/api/reports/summary-usage`

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_JWT_TOKEN",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || `Erreur ${response.status}`)
      }

      const result: SummaryUsageResponse = await response.json()
      setReport(result)
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement du rapport")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    fetchData()


  }

  const pagination = report?.pagination
  const totalPages = pagination?.totalPages || 1
  const currentPage = formData.page

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* === Formulaire === */}
      <Card className="border border-border bg-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Start date
              </label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="bg-input text-foreground border border-border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" /> End date
              </label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="bg-input text-foreground border border-border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Subscriber's name</label>
              <Input
                type="text"
                name="subscriberName"
                placeholder="ex: ECOBANK"
                value={formData.subscriberName}
                onChange={handleInputChange}
                className="bg-input text-foreground border border-border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Report type</label>
              <select
                name="reportType"
                value={formData.reportType}
                onChange={handleInputChange}
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary"
              >
                <option value="summary">Summary</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? "Chargement..." : "Rechercher"}
            </Button>
          </div>
        </form>
      </Card>

      {/* === Erreur === */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* === Résultats === */}
      {report && (
        <Card className="border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="border-b border-border bg-secondary/50 px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">Résultats</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Total: <span className="font-medium">{pagination?.totalRecords.toLocaleString("fr-F Budapest")}</span> recherches
            </p>
            <p className="text-sm">
              Du {format(new Date(report.startDate), "dd/MM/yyyy")} au {format(new Date(report.endDate), "dd/MM/yyyy")}
            </p>
            {report.subscriberName && (
              <p className="text-sm">
                <strong>SUbscriber :</strong> {report.subscriberName}
              </p>
            )}
            {report.companyPhysicalAddress1 && report.companyPhysicalAddress1 !== "N/A" && (
              <p className="text-sm">
                <strong>Address :</strong> {report.companyPhysicalAddress1}
              </p>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground">
                    Product
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-foreground">
                    Researches
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {report.data.map((item, index) => (
                  <tr
                    key={index}
                    className={`transition-colors ${
                      item.productDesc === "TOTAL" ? "bg-primary/10 font-semibold" : "hover:bg-muted/50"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-foreground">{item.productDesc}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-foreground">
                      {item.searchCount.toLocaleString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="border-t border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
              </div>

              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Button>

                <select
                  value={currentPage}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                  className="px-3 py-1 rounded-md border border-border bg-background text-sm text-foreground"
>D
                  {Array.from({ length: Math.min(10, totalPages) }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Page {i + 1}
                    </option>
                  ))}
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}