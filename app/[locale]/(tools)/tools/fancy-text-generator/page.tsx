'use client'

import { Copy, Check, Type, Skull, Minus, Plus, RefreshCw, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { useFancyTextGenerator } from '@/lib/hooks/widgets'
import { useTranslations } from 'next-intl'

export default function FancyTextGeneratorPage() {
  const t = useTranslations('widgets.fancyTextGenerator')
  
  const {
    inputText,
    copiedStyle,
    mounted,
    zalgoIntensity,
    zalgoText,
    generatedTexts,
    setInputText,
    setZalgoIntensity,
    copyToClipboard,
    copyZalgoText,
    loadExampleText,
    clearText,
    resetZalgoIntensity
  } = useFancyTextGenerator({
    translations: {
      copied: 'Text copied to clipboard!',
      copyError: 'Failed to copy text'
    }
  })

  if (!mounted) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Input Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="input-text" className="text-base font-semibold">
              Enter your text
            </Label>
            <div className="flex gap-2">
              <Button 
                onClick={loadExampleText} 
                variant="outline" 
                size="sm"
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Example
              </Button>
              <Button 
                onClick={clearText} 
                variant="outline" 
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </div>
          
          <Input
            id="input-text"
            placeholder="Type your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="text-lg"
          />
          
          <p className="text-sm text-muted-foreground">
            Enter any text to see it transformed into different fancy styles below
          </p>
        </div>
      </Card>

      <Tabs defaultValue="styles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="styles" className="gap-2">
            <Type className="w-4 h-4" />
            Font Styles
          </TabsTrigger>
          <TabsTrigger value="zalgo" className="gap-2">
            <Skull className="w-4 h-4" />
            Zalgo Text
          </TabsTrigger>
        </TabsList>

        {/* Font Styles Tab */}
        <TabsContent value="styles" className="space-y-4">
          {inputText.trim() ? (
            <div className="space-y-3">
              {generatedTexts.map(({ styleKey, styleName, text, description }) => (
                <Card key={styleKey} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{styleName}</h3>
                          {copiedStyle === styleKey && (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                      <Button
                        onClick={() => copyToClipboard(text, styleKey)}
                        size="sm"
                        variant="outline"
                        className={cn(
                          "gap-2 transition-colors",
                          copiedStyle === styleKey && "bg-green-50 border-green-200 text-green-700"
                        )}
                      >
                        {copiedStyle === styleKey ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        Copy
                      </Button>
                    </div>
                    
                    <div className="p-3 bg-muted rounded-lg font-mono text-lg break-all select-all">
                      {text}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8">
              <div className="text-center text-muted-foreground">
                <Type className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Text Entered</h3>
                <p className="text-sm">
                  Enter some text above to see it transformed into different fancy font styles.
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Zalgo Text Tab */}
        <TabsContent value="zalgo" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-semibold">
                    Zalgo Intensity: {zalgoIntensity}%
                  </Label>
                  <Button
                    onClick={resetZalgoIntensity}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <Minus className="w-4 h-4 text-muted-foreground" />
                  <Slider
                    value={[zalgoIntensity]}
                    onValueChange={(value) => setZalgoIntensity(value[0])}
                    max={100}
                    min={0}
                    step={10}
                    className="flex-1"
                  />
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  Adjust the intensity to control how chaotic the Zalgo text appears
                </p>
              </div>

              {inputText.trim() ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Skull className="w-4 h-4" />
                      Zalgo Text Result
                      {copiedStyle === 'zalgo' && (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                    </h3>
                    <Button
                      onClick={copyZalgoText}
                      variant="outline"
                      className={cn(
                        "gap-2 transition-colors",
                        copiedStyle === 'zalgo' && "bg-green-50 border-green-200 text-green-700"
                      )}
                    >
                      {copiedStyle === 'zalgo' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      Copy Zalgo
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg font-mono text-lg break-all select-all min-h-[80px] flex items-center">
                    {zalgoText}
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>What is Zalgo text?</strong></p>
                    <p>
                      Zalgo text is corrupted text that appears to be &ldquo;glitchy&rdquo; or &ldquo;cursed&rdquo; 
                      due to combining diacritical marks. It&apos;s often used for creative or 
                      horror-themed content.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Skull className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Text for Zalgo</h3>
                  <p className="text-sm">
                    Enter some text above to generate spooky Zalgo text effects.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Section */}
      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-3">About Fancy Text Generator</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-medium mb-2">Font Styles</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Mathematical alphanumeric symbols</li>
              <li>• Unicode-based transformations</li>
              <li>• Copy and paste anywhere</li>
              <li>• Social media compatible</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Use Cases</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Social media posts and bios</li>
              <li>• Headers and titles</li>
              <li>• Creative writing</li>
              <li>• Gaming usernames</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Features</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• {Object.keys(generatedTexts).length || 12}+ different font styles</li>
              <li>• Adjustable Zalgo intensity</li>
              <li>• Real-time preview</li>
              <li>• One-click copy</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}