"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "../../lib/utils"

export interface Step {
  id: number
  title: string
  description?: string
  completed?: boolean
}

export interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
  orientation?: "horizontal" | "vertical"
  variant?: "default" | "circle" | "bar" | "controlled"
  showTitle?: boolean
  showDescription?: boolean
  showStatus?: boolean
  className?: string
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      currentStep,
      onStepClick,
      orientation = "horizontal",
      variant = "default",
      showTitle = false,
      showDescription = false,
      showStatus = false,
      className,
    },
    ref
  ) => {
    const isVertical = orientation === "vertical"

    return (
      <nav
        ref={ref}
        aria-label="Progress"
        className={cn("w-full", className)}
      >
        <ol
          role="list"
          className={cn(
            "flex",
            isVertical ? "flex-col gap-4" : "items-center justify-between gap-2"
          )}
        >
          {steps.map((step, index) => {
            const isCurrent = currentStep === step.id
            // For controlled variant, use only the completed property from step
            // For other variants, auto-mark previous steps as completed
            const isCompleted = variant === "controlled" 
              ? step.completed === true
              : step.completed || step.id < currentStep
            const isClickable = onStepClick && (isCompleted || isCurrent)

            return (
              <li
                key={step.id}
                className={cn(
                  "flex items-center",
                  isVertical ? "w-full" : index < steps.length - 1 ? "flex-1" : "",
                  index < steps.length - 1 && !isVertical && "gap-2"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-3",
                    isVertical && "w-full"
                  )}
                >
                  {/* Step indicator */}
                  <button
                    type="button"
                    onClick={() => isClickable && onStepClick?.(step.id)}
                    disabled={!isClickable}
                    aria-current={isCurrent ? "step" : undefined}
                    className={cn(
                      "relative flex items-center justify-center rounded-full transition-all",
                      variant === "circle"
                        ? "h-10 w-10"
                        : "h-8 w-8",
                      isCompleted
                        ? "bg-primary text-primary-foreground border-2 border-primary"
                        : isCurrent
                        ? "border-2 border-primary bg-background text-primary"
                        : "border-2 border-muted-foreground/30 bg-background text-muted-foreground",
                      isClickable && "cursor-pointer hover:border-primary hover:text-primary",
                      !isClickable && "cursor-not-allowed opacity-60"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </button>

                  {/* Title and description */}
                  {(showTitle || showDescription) && (
                    <div className="flex flex-col">
                      {showTitle && (
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isCurrent
                              ? "text-foreground"
                              : isCompleted
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {step.title}
                        </span>
                      )}
                      {showDescription && step.description && (
                        <span className="text-xs text-muted-foreground">
                          {step.description}
                        </span>
                      )}
                      {showStatus && (
                        <span className="text-xs text-muted-foreground">
                          {isCompleted
                            ? "Completed"
                            : isCurrent
                            ? "In progress"
                            : "Pending"}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className={cn(
                      isVertical
                        ? "ml-4 h-8 w-0.5"
                        : "h-0.5 flex-1",
                      variant === "bar" && !isVertical && "h-1",
                      isCompleted
                        ? "bg-primary"
                        : "bg-muted"
                    )}
                  />
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }
)

Stepper.displayName = "Stepper"
