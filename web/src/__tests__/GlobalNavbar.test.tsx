import '@testing-library/jest-dom'

// Simple utility function tests
describe('Utility Functions', () => {
  it('formats numbers correctly', () => {
    const formatNumber = (num: number) => num.toLocaleString('en-US')
    
    expect(formatNumber(1000)).toBe('1,000')
    expect(formatNumber(120)).toBe('120')
  })

  it('validates data correctly', () => {
    const isValidCrewData = (data: unknown) => {
      return data !== null && data !== undefined && typeof (data as { total_crew_members?: number }).total_crew_members === 'number'
    }
    
    expect(isValidCrewData({ total_crew_members: 120 })).toBe(true)
    expect(isValidCrewData({})).toBe(false)
    expect(isValidCrewData(null)).toBe(false)
  })

  it('calculates percentages', () => {
    const calculatePercentage = (value: number, total: number) => {
      return ((value / total) * 100).toFixed(1) + '%'
    }
    
    expect(calculatePercentage(98.3, 100)).toBe('98.3%')
    expect(calculatePercentage(120, 122)).toBe('98.4%')
  })
})
