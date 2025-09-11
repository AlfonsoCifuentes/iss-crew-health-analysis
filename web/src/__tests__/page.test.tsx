import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Simple test to verify testing setup works
describe('Testing Setup', () => {
  it('renders a simple component', () => {
    render(<div>Test Component</div>)
    
    const element = screen.getByText('Test Component')
    expect(element).toBeInTheDocument()
  })

  it('basic math works', () => {
    expect(2 + 2).toBe(4)
  })

  it('strings work', () => {
    const str = 'ISS Crew Health Analysis'
    expect(str).toContain('ISS')
    expect(str).toContain('Health')
  })
})
