
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
    
    // Remove markdown code blocks if present
    if (responseContent.startsWith('```json')) {
      responseContent = responseContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (responseContent.startsWith('```')) {
      responseContent = responseContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    
    console.log('Cleaned response content:', responseContent)
    
    const extractedData = JSON.parse(responseContent)
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
