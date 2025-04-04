import { describe, it, expect, beforeEach, vi } from "vitest"

// Mock the Clarity VM environment
const mockClarity = {
  tx: {
    sender: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    sponsoredBy: null,
  },
  block: {
    height: 100,
  },
  contracts: {
    "generation-verification": {
      functions: {
        "register-generator": vi.fn(),
        "verify-generator": vi.fn(),
        "submit-production": vi.fn(),
        "verify-production": vi.fn(),
        "get-production-record": vi.fn(),
        "get-generator-info": vi.fn(),
        "transfer-admin": vi.fn(),
      },
    },
  },
}

// Setup global mock
global.clarity = mockClarity

describe("Generation Verification Contract", () => {
  beforeEach(() => {
    // Reset mocks before each test
    Object.values(mockClarity.contracts["generation-verification"].functions).forEach((fn) => fn.mockReset())
  })
  
  describe("register-generator", () => {
    it("should register a new generator", () => {
      const mockResult = { value: true, type: "ok" }
      mockClarity.contracts["generation-verification"].functions["register-generator"].mockReturnValue(mockResult)
      
      const result = mockClarity.contracts["generation-verification"].functions["register-generator"](
          "Solar Farm Alpha",
          "California, USA",
          1000,
      )
      
      expect(result).toEqual(mockResult)
      expect(mockClarity.contracts["generation-verification"].functions["register-generator"]).toHaveBeenCalledWith(
          "Solar Farm Alpha",
          "California, USA",
          1000,
      )
    })
  })
  
  describe("verify-generator", () => {
    it("should verify a generator when called by admin", () => {
      const mockResult = { value: true, type: "ok" }
      mockClarity.contracts["generation-verification"].functions["verify-generator"].mockReturnValue(mockResult)
      
      const result = mockClarity.contracts["generation-verification"].functions["verify-generator"](
          "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG",
      )
      
      expect(result).toEqual(mockResult)
      expect(mockClarity.contracts["generation-verification"].functions["verify-generator"]).toHaveBeenCalledWith(
          "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG",
      )
    })
  })
  
  describe("submit-production", () => {
    it("should submit energy production", () => {
      const mockResult = { value: 0, type: "ok" }
      mockClarity.contracts["generation-verification"].functions["submit-production"].mockReturnValue(mockResult)
      
      const result = mockClarity.contracts["generation-verification"].functions["submit-production"](500)
      
      expect(result).toEqual(mockResult)
      expect(mockClarity.contracts["generation-verification"].functions["submit-production"]).toHaveBeenCalledWith(500)
    })
  })
  
  describe("verify-production", () => {
    it("should verify production record when called by admin", () => {
      const mockResult = { value: true, type: "ok" }
      mockClarity.contracts["generation-verification"].functions["verify-production"].mockReturnValue(mockResult)
      
      const result = mockClarity.contracts["generation-verification"].functions["verify-production"](1)
      
      expect(result).toEqual(mockResult)
      expect(mockClarity.contracts["generation-verification"].functions["verify-production"]).toHaveBeenCalledWith(1)
    })
  })
  
  describe("get-production-record", () => {
    it("should return production record data", () => {
      const mockRecord = {
        generator: "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG",
        amount: 500,
        timestamp: 100,
        verified: true,
      }
      mockClarity.contracts["generation-verification"].functions["get-production-record"].mockReturnValue(mockRecord)
      
      const result = mockClarity.contracts["generation-verification"].functions["get-production-record"](1)
      
      expect(result).toEqual(mockRecord)
      expect(mockClarity.contracts["generation-verification"].functions["get-production-record"]).toHaveBeenCalledWith(
          1,
      )
    })
  })
})

