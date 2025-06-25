

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { image } = await req.json()
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment variables')
      throw new Error('OpenAI API key not configured')
    }

    console.log('Processing image with OpenAI...')
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Extract all transactions from this bank statement image and return ONLY a JSON array with this exact structure, nothing else: [{date: 'YYYY-MM-DD', description: 'string', amount: number}]. Amounts should be positive for credits and negative for debits. Do not include any explanatory text, only the JSON array." 
              },
              { 
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${image}`
                }
              }
            ],
          },
        ],
        max_tokens: 4096,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('OpenAI response received')
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API')
    }

    // Clean the response content to handle markdown-wrapped JSON
    let responseContent = data.choices[0].message.content.trim()
    console.log('Raw OpenAI response:', responseContent)
    
    // More robust cleaning of markdown code blocks
    responseContent = responseContent
      .replace(/^```json\s*/i, '')  // Remove opening ```json
      .replace(/^```\s*/, '')       // Remove opening ```
      .replace(/\s*```$/, '')       // Remove closing ```
      .replace(/^[\s\n]*/, '')      // Remove leading whitespace/newlines
      .replace(/[\s\n]*$/, '')      // Remove trailing whitespace/newlines
    
    console.log('Cleaned response content:', responseContent)
    
    // Validate that we have JSON-like content
    if (!responseContent.startsWith('[') && !responseContent.startsWith('{')) {
      console.error('Response does not appear to be JSON:', responseContent)
      throw new Error('OpenAI response is not valid JSON format')
    }
    
    let extractedData
    try {
      extractedData = JSON.parse(responseContent)
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError.message)
      console.error('Content that failed to parse:', responseContent)
      throw new Error('Failed to parse OpenAI response as JSON')
    }
    
    // Ensure we have an array
    if (!Array.isArray(extractedData)) {
      console.error('Parsed data is not an array:', extractedData)
      throw new Error('Expected an array of transactions')
    }
    
    console.log('Extracted transactions:', extractedData.length)

    return new Response(
      JSON.stringify({ transactions: extractedData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error processing bank statement:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

