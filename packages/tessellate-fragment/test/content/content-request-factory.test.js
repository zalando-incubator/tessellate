// @flow

jest.mock('tessellate-request')

import createRequest from '../../src/content/content-request-factory'

describe('content request factory', () => {

  it('should create request with undefined auth id', async () => {
    const mockRequest = createMockRequest()

    const createdRequest = createRequest({})

    expect(mockRequest.mock.instances[0]).toBe(createdRequest)
    expect(mockRequest.mock.calls.length).toBe(1);
    expect(mockRequest).toHaveBeenCalledWith(undefined)
  })

  it('should create request with auth id', async () => {
    const mockRequest = createMockRequest()
    const createdRequest = createRequest({auth: { id: 'id' }})

    expect(mockRequest.mock.instances[0]).toBe(createdRequest)
    expect(mockRequest.mock.calls.length).toBe(1);
    expect(mockRequest).toHaveBeenCalledWith('id')
  })

  function createMockRequest() {
    const mockRequest = require('tessellate-request').default
    mockRequest.mockReset()
    return mockRequest
  }
})
