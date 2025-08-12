import { Card } from '@/components/ui/card'

export function EmojiInfo() {
  return (
    <Card className="p-6 bg-muted/50">
      <h3 className="font-semibold mb-3">About This Tool</h3>
      <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
        <div>
          <h4 className="font-medium text-foreground mb-2">How to Use</h4>
          <ul className="space-y-1">
            <li>• Click any emoji to copy it to your clipboard</li>
            <li>• Hover and click the download icon to save as PNG image</li>
            <li>• Use the search bar to find specific emojis</li>
            <li>• Browse by category using the tabs</li>
            <li>• Your recent emojis are saved automatically</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-foreground mb-2">Features</h4>
          <ul className="space-y-1">
            <li>• 1,800+ emojis from Unicode 14.0</li>
            <li>• Instant copy with visual feedback</li>
            <li>• Download emojis as PNG images (256x256)</li>
            <li>• Recent emojis history (last 30)</li>
            <li>• Works on all modern devices</li>
          </ul>
        </div>
      </div>
      <p className="text-xs mt-4">
        If your device doesn&apos;t support certain emojis, they may appear as
        boxes or question marks. Update your system for the latest emoji
        support.
      </p>
      <div className="mt-4 p-4 bg-background rounded-lg">
        <h4 className="font-medium text-foreground mb-2 text-sm">
          Using Emojis in Social Media
        </h4>
        <p className="text-xs">
          For social media platforms like Facebook, Twitter, and Instagram,
          simply copy the emoji and paste it directly into your posts,
          comments, or bio. The download feature is useful when you need emoji
          images for blogs, websites, or applications that don&apos;t support
          Unicode emojis directly.
        </p>
      </div>
    </Card>
  )
}