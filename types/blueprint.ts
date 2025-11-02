export interface Blueprint {
  id: string
  title: string
  category: string
  difficulty: string
  time: string
  materials: string[]
  steps: string[]
  purpose: string
  warnings: string
  description?: string
  sciencePrinciple?: string
  funFacts?: string[]
  image?: string
}