import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Order, OrderStatus } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Check if an order can be cancelled (within 15 minutes of creation)
 */
export function canCancelOrder(order: Order): boolean {
  // Order must be in VALIDATED status to be cancellable
  if (order.status !== OrderStatus.VALIDATED) {
    return false
  }

  // Check if we have a cancellation deadline
  if (!order.canCancelUntil) {
    return false
  }

  // Check if current time is before the cancellation deadline
  return new Date() < new Date(order.canCancelUntil)
}

/**
 * Get the time remaining in minutes for order cancellation
 */
export function getTimeRemainingForCancellation(order: Order): number {
  if (!order.canCancelUntil) {
    return 0
  }

  const now = new Date().getTime()
  const deadline = new Date(order.canCancelUntil).getTime()
  const remainingMs = deadline - now

  // Return minutes, rounded down
  return Math.max(0, Math.floor(remainingMs / (1000 * 60)))
}
