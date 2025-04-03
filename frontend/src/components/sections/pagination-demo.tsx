"use client"

import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationDemoProps {
  totalItems: number
  itemsPerPage: number
  currentPage?: number
  onPageChange?: (page: number) => void
  className?: string
}

export function PaginationDemo({
  totalItems,
  itemsPerPage,
  currentPage = 1,
  onPageChange,
  className,
}: PaginationDemoProps) {
  const [page, setPage] = useState(currentPage)

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return

    setPage(newPage)
    onPageChange?.(newPage)
  }

  // Tạo mảng các trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = []

    // Luôn hiển thị trang đầu tiên
    pageNumbers.push(1)

    // Nếu trang hiện tại > 3, thêm dấu "..."
    if (page > 3) {
      pageNumbers.push("ellipsis1")
    }

    // Thêm trang trước trang hiện tại nếu > 1
    if (page > 2) {
      pageNumbers.push(page - 1)
    }

    // Thêm trang hiện tại nếu không phải trang đầu tiên hoặc cuối cùng
    if (page !== 1 && page !== totalPages) {
      pageNumbers.push(page)
    }

    // Thêm trang sau trang hiện tại nếu < totalPages
    if (page < totalPages - 1) {
      pageNumbers.push(page + 1)
    }

    // Nếu trang hiện tại < totalPages - 2, thêm dấu "..."
    if (page < totalPages - 2) {
      pageNumbers.push("ellipsis2")
    }

    // Luôn hiển thị trang cuối cùng nếu có nhiều hơn 1 trang
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(page - 1)
            }}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === "ellipsis1" || pageNumber === "ellipsis2") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={page === pageNumber}
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(pageNumber as number)
                }}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(page + 1)
            }}
            className={page === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

