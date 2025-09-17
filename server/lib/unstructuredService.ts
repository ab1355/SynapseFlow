// server/lib/unstructuredService.ts

export class UnstructuredService {
  private apiUrl: string;

  constructor() {
    // Point to the local instance of the unstructured API
    this.apiUrl = 'http://localhost:8002/general/v0/general';
  }

  public async processFile(file: Buffer, fileName: string): Promise<string> {
    const formData = new FormData();
    formData.append('files', new Blob([file]), fileName);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Unstructured API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
          return '';
      }

      // The response is an array of objects, each with a 'text' property.
      // Concatenate the text from all elements.
      return data.map(item => item.text).join('\n\n');
    } catch (error) {
      console.error('Error processing file with Unstructured API:', error);
      throw error;
    }
  }
}

export const unstructuredService = new UnstructuredService();
