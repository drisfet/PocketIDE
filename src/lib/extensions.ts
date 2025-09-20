import axios from 'axios'

export interface Extension {
  id: string
  namespace: string
  name: string
  version: string
  displayName: string
  description: string
  files: ExtensionFile[]
  downloadCount: number
  rating: number
  reviewCount: number
}

export interface ExtensionFile {
  path: string
  contentType: string
  size: number
}

export interface ExtensionSearchResult {
  extensions: Extension[]
  total: number
}

// Open VSX API base URL
const OPEN_VSX_API_URL = process.env.NEXT_PUBLIC_OPEN_VSX_API_URL || 'https://open-vsx.org/api'

// Open VSX extension search
export async function searchExtensions(query: string, category?: string): Promise<ExtensionSearchResult> {
  try {
    const params = new URLSearchParams({
      query,
      size: '20',
    })
    
    if (category) {
      params.append('category', category)
    }

    const response = await axios.get(`${OPEN_VSX_API_URL}/search`, { params })
    return {
      extensions: response.data.extensions || [],
      total: response.data.total || 0,
    }
  } catch (error) {
    console.error('Failed to search extensions:', error)
    return { extensions: [], total: 0 }
  }
}

// Get extension details
export async function getExtension(namespace: string, name: string): Promise<Extension | null> {
  try {
    const response = await axios.get(`${OPEN_VSX_API_URL}/${namespace}/${name}`)
    return response.data
  } catch (error) {
    console.error('Failed to get extension details:', error)
    return null
  }
}

// Download extension files
export async function downloadExtension(namespace: string, name: string, version?: string): Promise<ExtensionFile[]> {
  try {
    const url = version 
      ? `${OPEN_VSX_API_URL}/${namespace}/${name}/${version}/file-releases`
      : `${OPEN_VSX_API_URL}/${namespace}/${name}/latest/file-releases`
    
    const response = await axios.get(url)
    return response.data.files || []
  } catch (error) {
    console.error('Failed to download extension:', error)
    return []
  }
}

// Get popular extensions
export async function getPopularExtensions(category?: string): Promise<Extension[]> {
  try {
    const params = new URLSearchParams({
      size: '10',
      sort: 'downloadCount',
    })
    
    if (category) {
      params.append('category', category)
    }

    const response = await axios.get(`${OPEN_VSX_API_URL}/search`, { params })
    return response.data.extensions || []
  } catch (error) {
    console.error('Failed to get popular extensions:', error)
    return []
  }
}

// Get extension categories
export async function getCategories(): Promise<string[]> {
  try {
    const response = await axios.get(`${OPEN_VSX_API_URL}/categories`)
    return response.data.categories || []
  } catch (error) {
    console.error('Failed to get categories:', error)
    return []
  }
}

// Install extension (placeholder for actual implementation)
export async function installExtension(extension: Extension): Promise<boolean> {
  try {
    // In a real implementation, this would:
    // 1. Download the extension files
    // 2. Extract them
    // 3. Load them into Monaco Editor
    // 4. Configure the extension
    
    console.log('Installing extension:', extension.displayName)
    
    // For now, just return true
    return true
  } catch (error) {
    console.error('Failed to install extension:', error)
    return false
  }
}

// Get recommended extensions based on project type
export async function getRecommendedExtensions(projectType: string): Promise<Extension[]> {
  try {
    const categoryMap: Record<string, string> = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'python': 'Python',
      'java': 'Java',
      'go': 'Go',
      'rust': 'Rust',
      'php': 'PHP',
      'html': 'HTML',
      'css': 'CSS',
      'json': 'JSON',
    }

    const category = categoryMap[projectType.toLowerCase()] || 'Other'
    return await getPopularExtensions(category)
  } catch (error) {
    console.error('Failed to get recommended extensions:', error)
    return []
  }
}