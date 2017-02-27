jest.mock('tessellate-request')

import * as contentService from '../../src/content/content-service'

describe('content service', () => {

  it('should return empty content with empty source', async () => {
    const content = await contentService.fetchContent({})

    expect(content).toEqual({})
  })

  it('should return content from properties source', async () => {
    const sources = {
      properties: {
        src: 'https://content.com',
        auth: {
          id: 'content-service'
        }
      }
    }
    const expectedContent = { content: "Lorem ..." }
    const mockGet = jest.fn(() => JSON.stringify(expectedContent))
    let mockRequest = require('tessellate-request').default.mockImplementation(() => {
        return { get: mockGet }
      }
    )

    const content = await contentService.fetchContent(sources)

    expect(mockRequest).toHaveBeenCalledWith('content-service')
    expect(mockGet).toHaveBeenCalledWith('https://content.com')
    expect(content).toEqual(expectedContent)
  })
})
