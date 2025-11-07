/**
 * Handles API responses uniformly across the SDK.
 * 
 * @param {Response} response - The fetch Response object
 * @returns {Promise<Object>} Parsed and validated response data
 * @throws {Error} When response format is invalid or status is 'failed'
 */
export async function handleResponse(response) {
  const data = await response.json();

  if (!data || typeof data.status !== 'string') {
    throw new Error('Invalid response format from Wix API');
  }

  if (data.status === 'failed') {
    const msg = data.errorMessage || data.error || 'Unknown error';
    const error = new Error(`Wix API Error: ${formatErrorMessage(msg)}`);
    error.wixError = data;
    throw error;
  }

  return data;
}

/**
 * Formats error messages from Wix API.
 * @private
 */
function formatErrorMessage(msg) {
  // Se for objeto de erro detalhado
  if (typeof msg === 'object' && msg !== null) {
    const code = msg.details?.applicationError?.code;
    const description = msg.details?.applicationError?.description;
    const errorCode = msg.code;
    
    if (description) {
      return description;
    }
    
    if (code) {
      return `${code}: ${msg.name || 'Error'}`;
    }
    
    if (errorCode) {
      // Mensagens amigáveis para códigos comuns
      const friendlyMessages = {
        'WD_SCHEMA_DOES_NOT_EXIST': 'Collection does not exist. Check the collection name in your Wix Data panel.',
        'WD_PERMISSION_DENIED': 'Permission denied. Check your API token and collection permissions.',
        'WD_INVALID_QUERY': 'Invalid query syntax.',
      };
      
      return friendlyMessages[errorCode] || `Error code: ${errorCode}`;
    }
  }
  
  return typeof msg === 'string' ? msg : JSON.stringify(msg);
}

/**
 * Determines if an error is retryable.
 * 
 * @param {Error} error - The error to check
 * @returns {boolean} true if the error is retryable
 */
export function isRetryableError(error) {
  // Não retentar erros de validação/cliente (4xx exceto 429 e 408)
  if (error.status) {
    if (error.status >= 400 && error.status < 500) {
      // Exceto Rate Limit e Request Timeout
      if (error.status !== 429 && error.status !== 408) {
        return false;
      }
    }
  }
  
  // Network errors
  if (error.message?.includes('timeout')) return true;
  if (error.message?.includes('network')) return true;
  if (error.message?.includes('fetch')) return true;
  if (error.message?.includes('ECONNREFUSED')) return true;
  if (error.message?.includes('ETIMEDOUT')) return true;
  
  // HTTP status codes that should be retried
  if (error.status) {
    // 429 Too Many Requests
    if (error.status === 429) return true;
    
    // 408 Request Timeout
    if (error.status === 408) return true;
    
    // 5xx Server Errors
    if (error.status >= 500 && error.status < 600) return true;
  }
  
  return false;
}

/**
 * Creates a detailed error object from a failed Response.
 * 
 * @param {Response} response - The failed fetch Response
 * @returns {Promise<Error>} A detailed error object
 */
export async function createDetailedError(response) {
  let body = null;
  
  try {
    body = await response.json();
  } catch {
    try {
      body = await response.text();
    } catch {
      body = null;
    }
  }
  
  // Criar mensagem de erro amigável
  let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
  
  if (body?.errorMessage) {
    errorMessage = formatErrorMessage(body.errorMessage);
  } else if (body?.error) {
    errorMessage = formatErrorMessage(body.error);
  }
  
  const error = new Error(errorMessage);
  error.status = response.status;
  error.statusText = response.statusText;
  error.url = response.url;
  error.body = body;
  
  return error;
}