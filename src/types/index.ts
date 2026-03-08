export type Opportunity = {
  name: string
  type: "Hackathon" | "Scholarship" | "Conference" | "Grant" | "Fellowship"
  organization: string
  deadline: string
  description: string
  url: string
  whyMatch: string
  fundingAmount?: string
  location: string
}

export type UserProfile = {
  id: string
  name: string
  field: string
  stage: string
  country: string
  interests: string[]
}

export type TrackerStatus = 'want_to_apply' | 'applied' | 'heard_back'

export type SavedOpportunity = Opportunity & {
  id: string
  status: TrackerStatus
  notes: string
}
