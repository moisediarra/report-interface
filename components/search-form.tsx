"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, Search, Loader2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"

// === Types API ===
interface SummaryUsageItem {
  productDesc: string
  searchCount: number
  searchDate: string
  subscriberName: string
  companyPhysicalAddress1: string
  reportType: string
  startDate: string
  endDate: string

}

interface SummaryUsageResponse {
  startDate: string
  endDate: string
  subscriberName: string
  companyPhysicalAddress1: string
  reportType: string
  data: SummaryUsageItem[]
}

export default function SummaryUsageReport() {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    subscriberName: "",
    reportType: "",
  })

  const [report, setReport] = useState<SummaryUsageResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setReport(null)

    try {
      const payload = {
        startDate: formData.startDate,
        endDate: formData.endDate,
        subscriberName: formData.subscriberName || null,
        reportType: formData.reportType,
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5186"
      const endpoint = `${apiUrl}/api/reports/summary-usage`

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_JWT_TOKEN", // Remplace par ton token
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const message = `filled ${response.status} - ${response.statusText}`;
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || `Erreur ${response.status}`)
      }

      const data: SummaryUsageResponse = await response.json()
      setReport(data)
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement du rapport")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-4">
      {/* === Formulaire === */}
      <Card className="border border-border bg-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4" />
                  Start date
                </div>
              </label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="bg-input text-foreground border border-border"
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4" />
                  End date
                </div>
              </label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="bg-input text-foreground border border-border"
              />
            </div>

            {/* Subscriber Name */}
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

            {/* Report Type */}
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

          {/* Bouton */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground hover915:bg-primary/90 gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
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

      {/* === Result === */}
      {report && (
        <Card className="border border-border bg-card p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Summary Usage Report</h3>
            <p className="text-sm text-muted-foreground">
              To {format(new Date(report.startDate), "dd/MM/yyyy")} to {" "}
              {format(new Date(report.endDate), "dd/MM/yyyy")}
            </p>
            {report.subscriberName && (
              <p className="text-sm">
                <strong>Subscriber :</strong> {report.subscriberName}
              </p>
            )}
            {report.companyPhysicalAddress1 && report.companyPhysicalAddress1 !== "N/A" && (
              <p className="text-sm">
                <strong>Address :</strong> {report.companyPhysicalAddress1}
              </p>
            )}
          </div>

          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-muted/50">Product</TableHead>
                  <TableHead className="bg-muted/50 text-right">Research</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.data.map((item, index) => (
                  <TableRow
                    key={index}
                    className={item.productDesc === "TOTAL" ? "bg-primary/5 font-bold" : ""}
                  >
                    <TableCell>{item.productDesc}</TableCell>
                    <TableCell className="text-right">
                      {item.searchCount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  )
}