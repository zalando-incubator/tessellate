// @flow

jest.mock('../../src/content/content-request-factory')
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
        src: 'https://content.com'
      }
    }
    const expectedContent = { content: "Lorem ..." }

    const mockRequest = require('tessellate-request').default
    mockRequest.get = jest.fn(() => JSON.stringify(expectedContent));

    const mockRequestFactory = require('../../src/content/content-request-factory').default
    mockRequestFactory.mockImplementation(() => mockRequest)

    const content = await contentService.fetchContent(sources)

    expect(mockRequest.get).toHaveBeenCalledWith('https://content.com')
    expect(content).toEqual(expectedContent)
  })
})
