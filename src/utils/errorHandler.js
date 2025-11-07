/**
 * Handles API responses uniformly across the SDK.
 */
export async function handleResponse(response) {
  const data = await response.json();

  if (!data || typeof data.status !== 'string') {
    throw new Error('Invalid response format from Wix API');
  }

  if (data.status === 'failed') {
    const msg = data.errorMessage || data.error || 'Unknown error';
    throw new Error(`Wix API Error: ${msg}`);
  }

  return data;
}
