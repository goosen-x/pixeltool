'use client'

import { Copy, Check, Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useSpecialSymbolsPicker } from '@/lib/hooks/widgets'
import { useTranslations } from 'next-intl'

export default function SpecialSymbolsPickerPage() {
	const t = useTranslations('widgets.specialSymbolsPicker')

	const {
		searchQuery,
		copiedSymbol,
		recentSymbols,
		filteredSymbols,
		filteredCategories,
		symbolCategories,
		totalSymbolsCount,
		setSearchQuery,
		copySymbol,
		clearRecentSymbols,
		getCategoryBySymbol
	} = useSpecialSymbolsPicker({
		translations: {
			copied: 'Symbol copied to clipboard!',
			copyError: 'Failed to copy symbol'
		}
	})

	return (
		<div className='max-w-6xl mx-auto space-y-6'>
			{/* Search Bar */}
			<Card className='p-6'>
				<div className='flex items-center gap-4'>
					<div className='relative flex-1'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
						<Input
							placeholder='Search symbols or categories...'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							className='pl-10'
						/>
					</div>
					<div className='text-sm text-muted-foreground'>
						{totalSymbolsCount} symbols available
					</div>
				</div>
			</Card>

			<Tabs defaultValue='browse' className='space-y-6'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='browse'>Browse Categories</TabsTrigger>
					<TabsTrigger value='recent'>
						Recent ({recentSymbols.length})
					</TabsTrigger>
				</TabsList>

				{/* Browse Tab */}
				<TabsContent value='browse' className='space-y-6'>
					{searchQuery ? (
						// Search Results
						<Card className='p-6'>
							<div className='mb-4'>
								<h2 className='text-xl font-semibold'>
									Search Results for &ldquo;{searchQuery}&rdquo;
								</h2>
								<p className='text-sm text-muted-foreground'>
									{filteredSymbols ? filteredSymbols.length : 0} symbols found
								</p>
							</div>

							{filteredSymbols && filteredSymbols.length > 0 ? (
								<div className='grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 xl:grid-cols-24 gap-2'>
									{filteredSymbols.map((symbol, index) => (
										<Button
											key={`${symbol}-${index}`}
											variant='outline'
											size='sm'
											className={cn(
												'h-12 w-12 p-0 text-lg hover:bg-primary hover:text-primary-foreground transition-colors',
												copiedSymbol === symbol &&
													'bg-green-100 border-green-300'
											)}
											onClick={() => copySymbol(symbol)}
											title={`Copy "${symbol}" - from ${getCategoryBySymbol(symbol) || 'Unknown'} category`}
										>
											{copiedSymbol === symbol ? (
												<Check className='w-4 h-4 text-green-600' />
											) : (
												symbol
											)}
										</Button>
									))}
								</div>
							) : (
								<div className='text-center py-8 text-muted-foreground'>
									<Search className='w-12 h-12 mx-auto mb-4 opacity-50' />
									<p>No symbols found for &ldquo;{searchQuery}&rdquo;</p>
									<p className='text-sm'>
										Try searching for categories like &ldquo;stars&rdquo;,
										&ldquo;hearts&rdquo;, or &ldquo;arrows&rdquo;
									</p>
								</div>
							)}
						</Card>
					) : (
						// Category View
						<div className='grid gap-6'>
							{filteredCategories &&
								Object.entries(filteredCategories).map(([key, category]) => (
									<Card key={key} className='p-6'>
										<div className='mb-4'>
											<h2 className='text-xl font-semibold'>{category.name}</h2>
											<p className='text-sm text-muted-foreground'>
												{category.symbols.length} symbols
											</p>
										</div>

										<div className='grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 xl:grid-cols-24 gap-2'>
											{category.symbols.map((symbol, index) => (
												<Button
													key={`${key}-${symbol}-${index}`}
													variant='outline'
													size='sm'
													className={cn(
														'h-12 w-12 p-0 text-lg hover:bg-primary hover:text-primary-foreground transition-colors',
														copiedSymbol === symbol &&
															'bg-green-100 border-green-300'
													)}
													onClick={() => copySymbol(symbol)}
													title={`Copy "${symbol}"`}
												>
													{copiedSymbol === symbol ? (
														<Check className='w-4 h-4 text-green-600' />
													) : (
														symbol
													)}
												</Button>
											))}
										</div>
									</Card>
								))}
						</div>
					)}
				</TabsContent>

				{/* Recent Tab */}
				<TabsContent value='recent' className='space-y-6'>
					<Card className='p-6'>
						<div className='flex items-center justify-between mb-4'>
							<div>
								<h2 className='text-xl font-semibold'>Recently Used Symbols</h2>
								<p className='text-sm text-muted-foreground'>
									Your last {recentSymbols.length} used symbols
								</p>
							</div>
							{recentSymbols.length > 0 && (
								<Button
									onClick={clearRecentSymbols}
									variant='outline'
									size='sm'
								>
									Clear All
								</Button>
							)}
						</div>

						{recentSymbols.length > 0 ? (
							<div className='grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 xl:grid-cols-24 gap-2'>
								{recentSymbols.map((symbol, index) => (
									<Button
										key={`recent-${symbol}-${index}`}
										variant='outline'
										size='sm'
										className={cn(
											'h-12 w-12 p-0 text-lg hover:bg-primary hover:text-primary-foreground transition-colors',
											copiedSymbol === symbol && 'bg-green-100 border-green-300'
										)}
										onClick={() => copySymbol(symbol)}
										title={`Copy "${symbol}" - from ${getCategoryBySymbol(symbol) || 'Unknown'} category`}
									>
										{copiedSymbol === symbol ? (
											<Check className='w-4 h-4 text-green-600' />
										) : (
											symbol
										)}
									</Button>
								))}
							</div>
						) : (
							<div className='text-center py-8 text-muted-foreground'>
								<Copy className='w-12 h-12 mx-auto mb-4 opacity-50' />
								<p>No recently used symbols</p>
								<p className='text-sm'>
									Start copying symbols to see them here
								</p>
							</div>
						)}
					</Card>
				</TabsContent>
			</Tabs>

			{/* Info Section */}
			<Card className='p-6 bg-muted/50'>
				<h3 className='font-semibold mb-3'>About Special Symbols</h3>
				<div className='grid md:grid-cols-3 gap-6 text-sm'>
					<div>
						<h4 className='font-medium mb-2'>Usage Tips</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• Click any symbol to copy it instantly</li>
							<li>• Use search to find symbols quickly</li>
							<li>• Recent symbols are saved locally</li>
							<li>• Works with any text editor or app</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium mb-2'>Categories</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>
								• {Object.keys(symbolCategories).length} different categories
							</li>
							<li>• Popular symbols for quick access</li>
							<li>• Mathematical and technical symbols</li>
							<li>• Decorative and artistic symbols</li>
						</ul>
					</div>
					<div>
						<h4 className='font-medium mb-2'>Compatibility</h4>
						<ul className='text-muted-foreground space-y-1'>
							<li>• Works in all modern browsers</li>
							<li>• Compatible with social media</li>
							<li>• Supports Unicode standards</li>
							<li>• Cross-platform symbol support</li>
						</ul>
					</div>
				</div>
			</Card>
		</div>
	)
}
