export interface JobListing {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  applyUrl: string
  /** Long-form role summary. Feeds the JobPosting JSON-LD on /careers. */
  description?: string
  /** ISO date the row was created; used as JobPosting.datePosted. */
  datePosted?: string
}

export const jobs: JobListing[] = [
  {
    id: '1',
    title: 'Senior UI/UX Designer',
    department: 'Design',
    location: 'Kochi',
    type: 'Full-Time',
    experience: '7+ Years Experience',
    applyUrl: ''
  },
  {
    id: '2',
    title: 'Senior UI/UX Designer',
    department: 'Design',
    location: 'Kochi',
    type: 'Full-Time',
    experience: '7+ Years Experience',
    applyUrl: ''
  },
  {
    id: '3',
    title: 'Senior UI/UX Designer',
    department: 'Design',
    location: 'Kochi',
    type: 'Full-Time',
    experience: '7+ Years Experience',
    applyUrl: ''
  }
]
