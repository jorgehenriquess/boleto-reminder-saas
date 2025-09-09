import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR').format(dateObj)
}

export function formatCPFCNPJ(value: string): string {
  const cleanValue = value.replace(/\D/g, '')
  
  if (cleanValue.length <= 11) {
    // CPF: 000.000.000-00
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  } else {
    // CNPJ: 00.000.000/0000-00
    return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
}

export function formatPhone(value: string): string {
  const cleanValue = value.replace(/\D/g, '')
  
  if (cleanValue.length <= 10) {
    // Telefone fixo: (00) 0000-0000
    return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  } else {
    // Celular: (00) 00000-0000
    return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
}

export function getBoletoStatusColor(status: string): string {
  const statusColors = {
    pending: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    paid: 'text-green-700 bg-green-50 border-green-200',
    overdue: 'text-red-700 bg-red-50 border-red-200',
    cancelled: 'text-gray-700 bg-gray-50 border-gray-200',
  }
  
  return statusColors[status as keyof typeof statusColors] || statusColors.pending
}

export function getBoletoStatusLabel(status: string): string {
  const statusLabels = {
    pending: 'Pendente',
    paid: 'Pago',
    overdue: 'Vencido',
    cancelled: 'Cancelado',
  }
  
  return statusLabels[status as keyof typeof statusLabels] || 'Pendente'
}