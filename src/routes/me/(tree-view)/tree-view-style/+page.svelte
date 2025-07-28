<script lang="ts">
	import { TreeViewGroup, TreeViewItem } from '$lib/components/ui/tree-view';
	import type { TreeItem, TreeViewProps } from '$lib/components/ui/tree-view/types';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '$lib/components/ui/tooltip';
	import { Folder, FolderOpen, File, FileText, Image, Code, Music, Video, Archive, Settings, Info, ChevronRight, ChevronDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	
	// Sample data with different types for testing
	const sampleItems: TreeItem<{ type: string; extension?: string; description?: string }>[] = [
		{
			id: '1',
			label: 'Documents',
			data: { type: 'folder', description: 'Important documents' },
			children: [
				{
					id: '1.1',
					label: 'Work',
					data: { type: 'folder', description: 'Work-related files' },
					children: [
						{ id: '1.1.1', label: 'Report.pdf', data: { type: 'file', extension: 'pdf', description: 'Quarterly report' } },
						{ id: '1.1.2', label: 'Presentation.pptx', data: { type: 'file', extension: 'pptx', description: 'Sales presentation' } },
						{ id: '1.1.3', label: 'Notes.txt', data: { type: 'file', extension: 'txt', description: 'Meeting notes' }, disabled: true }
					]
				},
				{
					id: '1.2',
					label: 'Personal',
					data: { type: 'folder', description: 'Personal files' },
					isExpandable: true,
					children: []
				}
			]
		},
		{
			id: '2',
			label: 'Media',
			data: { type: 'folder', description: 'Media files' },
			children: [
				{
					id: '2.1',
					label: 'Images',
					data: { type: 'folder', description: 'Image collection' },
					children: [
						{ id: '2.1.1', label: 'vacation.jpg', data: { type: 'file', extension: 'jpg', description: 'Summer vacation' } },
						{ id: '2.1.2', label: 'profile.png', data: { type: 'file', extension: 'png', description: 'Profile picture' } }
					]
				},
				{
					id: '2.2',
					label: 'Videos',
					data: { type: 'folder', description: 'Video collection' },
					children: [
						{ id: '2.2.1', label: 'tutorial.mp4', data: { type: 'file', extension: 'mp4', description: 'Tutorial video' } }
					]
				},
				{
					id: '2.3',
					label: 'Music',
					data: { type: 'folder', description: 'Music library' },
					children: [
						{ id: '2.3.1', label: 'playlist.m3u', data: { type: 'file', extension: 'm3u', description: 'Favorite playlist' } }
					]
				}
			]
		},
		{
			id: '3',
			label: 'Development',
			data: { type: 'folder', description: 'Code projects' },
			children: [
				{ id: '3.1', label: 'index.js', data: { type: 'file', extension: 'js', description: 'Main script' } },
				{ id: '3.2', label: 'styles.css', data: { type: 'file', extension: 'css', description: 'Styles' } },
				{ id: '3.3', label: 'package.json', data: { type: 'file', extension: 'json', description: 'Dependencies' } }
			]
		},
		{
			id: '4',
			label: 'Archive.zip',
			data: { type: 'file', extension: 'zip', description: 'Compressed archive' },
			disabled: true
		}
	];

	// State for different examples
	let expandedIds = $state(new Set(['1', '2']));
	let selectedId = $state('1.1');
	let multiSelectedIds = $state(new Set(['2.1', '2.2']));

	// Configurable variables
	let indentSize = $state(20);
	let itemHeight = $state('default'); // 'small' | 'default' | 'large'
	let iconSize = $state(16);
	let fontSize = $state(14);
	let itemPadding = $state(8);
	let itemGap = $state(8);
	let borderRadius = $state(6);
	let expandIconType = $state<'chevron' | 'plus' | 'triangle'>('chevron');
	let showIcons = $state(true);
	let showBadges = $state(true);
	let showDescriptions = $state(true);
	let showExtensions = $state(true);
	let hoverEffect = $state(true);
	let focusRing = $state(true);
	let animateExpand = $state(true);

	// Event handlers
	function handleSelect(item: TreeItem, selected: boolean) {
		selectedId = selected ? item.id : '';
		console.log('Selected:', item.label, selected);
	}

	function handleMultiSelect(item: TreeItem, selected: boolean) {
		if (selected) {
			multiSelectedIds = new Set([...multiSelectedIds, item.id]);
		} else {
			multiSelectedIds = new Set([...multiSelectedIds].filter(id => id !== item.id));
		}
		multiSelectedIds = multiSelectedIds;
	}

	function handleExpand(item: TreeItem, expanded: boolean) {
		if (expanded) {
			expandedIds = new Set([...expandedIds, item.id]);
		} else {
			expandedIds = new Set([...expandedIds].filter(id => id !== item.id));
		}
		expandedIds = expandedIds;
	}

	// Get expand icon based on type
	function getExpandIcon(expanded: boolean) {
		switch (expandIconType) {
			case 'chevron':
				return expanded ? ChevronDown : ChevronRight;
			case 'plus':
				return expanded ? ChevronDown : ChevronRight;
			case 'triangle':
				return expanded ? ChevronDown : ChevronRight;
			default:
				return ChevronRight;
		}
	}

	// Get dynamic styles based on configuration
	function getItemStyles() {
		return {
			fontSize: `${fontSize}px`,
			padding: `${itemPadding}px`,
			gap: `${itemGap}px`,
			borderRadius: `${borderRadius}px`
		};
	}

	function getIconStyles() {
		return {
			width: `${iconSize}px`,
			height: `${iconSize}px`
		};
	}

	// Get icon based on file type
	function getIcon(item: TreeItem, isExpanded?: boolean) {
		const type = item.data?.type;
		const ext = item.data?.extension;
		
		if (type === 'folder') {
			return isExpanded ? FolderOpen : Folder;
		}
		
		// Map extensions to icons
		if (ext === 'pdf' || ext === 'txt') return FileText;
		if (ext === 'jpg' || ext === 'png') return Image;
		if (ext === 'js' || ext === 'css') return Code;
		if (ext === 'mp4') return Video;
		if (ext === 'm3u') return Music;
		if (ext === 'zip') return Archive;
		
		return File;
	}

	function getItemVariant(item: TreeItem): 'default' | 'ghost' | 'selected' | 'active' {
		if (item.disabled) return 'ghost';
		if (item.id === '2') return 'active';
		if (selectedId === item.id) return 'selected';
		return 'default';
	}

</script>

<div class="container mx-auto p-6 space-y-8">
	<h1 class="text-3xl font-bold mb-6">TreeView Component Examples</h1>

	<Tabs value="basic" class="w-full">
		<TabsList class="grid w-full grid-cols-4">
			<TabsTrigger value="basic">Basic</TabsTrigger>
			<TabsTrigger value="configuration">Configuration</TabsTrigger>
			<TabsTrigger value="styles">Styles</TabsTrigger>
			<TabsTrigger value="custom">Custom Rendering</TabsTrigger>
		</TabsList>

		<TabsContent value="basic" class="space-y-4">
			<h2 class="text-2xl font-semibold">Basic TreeView</h2>
			<div class="space-y-4">
				<div>
					<Label>Single Selection with Expand/Collapse</Label>
					<div class="border rounded-lg p-4 mt-2">
						{#each sampleItems as item}
							<TreeViewGroup
								{item}
								expanded={expandedIds.has(item.id)}
								onToggle={() => handleExpand(item, !expandedIds.has(item.id))}
								class="mb-1"
							>
								{#snippet icon(expanded)}
									{@const Icon = getIcon(item, expanded)}
									<Icon class="h-4 w-4 text-muted-foreground" />
								{/snippet}

								{#snippet label()}
									<span class={selectedId === item.id ? 'font-semibold' : ''}>{item.label}</span>
								{/snippet}

								{#snippet children()}
									{#if item.children}
										<div class="ml-4 space-y-1 mt-1">
											{#each item.children as child}
												<TreeViewItem
													item={child}
													level={1}
													selected={selectedId === child.id}
													onclick={() => handleSelect(child, selectedId !== child.id)}
													variant={selectedId === child.id ? 'selected' : 'default'}
													disabled={child.disabled}
												>
													{#snippet children()}
														{@const ChildIcon = getIcon(child)}
														<div class="flex items-center gap-2">
															<ChildIcon class="h-4 w-4 text-muted-foreground" />
															<span>{child.label}</span>
														</div>
													{/snippet}
												</TreeViewItem>
											{/each}
										</div>
									{/if}
								{/snippet}
							</TreeViewGroup>
						{/each}
					</div>
					<p class="text-sm text-muted-foreground mt-2">
						Selected: {selectedId || 'None'} | Expanded: {[...expandedIds].join(', ')}
					</p>
				</div>

				<Separator />

				<div>
					<Label>Multi-Selection</Label>
					<div class="border rounded-lg p-4 mt-2">
						{#each sampleItems as item}
							<TreeViewGroup
								{item}
								expanded={expandedIds.has(item.id)}
								onToggle={() => handleExpand(item, !expandedIds.has(item.id))}
								class="mb-1"
							>
								{#snippet icon(expanded)}
									{@const Icon = getIcon(item, expanded)}
									<Icon class="h-4 w-4 text-muted-foreground" />
								{/snippet}

								{#snippet label()}
									<span>{item.label}</span>
								{/snippet}

								{#snippet children()}
									{#if item.children}
										<div class="ml-4 space-y-1 mt-1">
											{#each item.children as child}
												<TreeViewItem
													item={child}
													level={1}
													selected={multiSelectedIds.has(child.id)}
													onclick={() => handleMultiSelect(child, !multiSelectedIds.has(child.id))}
													variant={multiSelectedIds.has(child.id) ? 'selected' : 'default'}
													disabled={child.disabled}
												>
													{#snippet children()}
														{@const ChildIcon = getIcon(child)}
														<div class="flex items-center gap-2">
															<ChildIcon class="h-4 w-4 text-muted-foreground" />
															<span>{child.label}</span>
														</div>
													{/snippet}
												</TreeViewItem>
											{/each}
										</div>
									{/if}
								{/snippet}
							</TreeViewGroup>
						{/each}
					</div>
					<p class="text-sm text-muted-foreground mt-2">
						Selected: {[...multiSelectedIds].join(', ') || 'None'}
					</p>
				</div>

				<Separator />

				<div>
					<Label>Custom Indent Size</Label>
					<div class="flex items-center gap-4 mb-2">
						<Button variant="outline" size="sm" onclick={() => indentSize = Math.max(10, indentSize - 5)}>
							Decrease
						</Button>
						<span>Indent: {indentSize}px</span>
						<Button variant="outline" size="sm" onclick={() => indentSize = Math.min(40, indentSize + 5)}>
							Increase
						</Button>
					</div>
					<div class="border rounded-lg p-4">
						{#each sampleItems as item}
							<TreeViewGroup
								{item}
								expanded={expandedIds.has(item.id)}
								onToggle={() => handleExpand(item, !expandedIds.has(item.id))}
								{indentSize}
								class="mb-1"
							>
								{#snippet icon(expanded)}
									{@const Icon = getIcon(item, expanded)}
									<Icon class="h-4 w-4 text-muted-foreground" />
								{/snippet}

								{#snippet label()}
									<span>{item.label}</span>
								{/snippet}

								{#snippet children()}
									{#if item.children}
										<div class="space-y-1 mt-1" style="margin-left: {indentSize}px">
											{#each item.children as child}
												<TreeViewItem
													item={child}
													level={1}
													{indentSize}
													selected={selectedId === child.id}
													onclick={() => handleSelect(child, selectedId !== child.id)}
													variant={selectedId === child.id ? 'selected' : 'default'}
													disabled={child.disabled}
												>
													{#snippet children()}
														{@const ChildIcon = getIcon(child)}
														<div class="flex items-center gap-2">
															<ChildIcon class="h-4 w-4 text-muted-foreground" />
															<span>{child.label}</span>
														</div>
													{/snippet}
												</TreeViewItem>
											{/each}
										</div>
									{/if}
								{/snippet}
							</TreeViewGroup>
						{/each}
					</div>
				</div>
			</div>
		</TabsContent>

		<TabsContent value="configuration" class="space-y-4">
			<h2 class="text-2xl font-semibold">Configuration Options</h2>
			<div class="space-y-6">
				<div class="grid grid-cols-2 gap-6">
					<div class="space-y-4">
						<h3 class="text-lg font-medium">Dimensions</h3>
						
						<div>
							<Label>Indent Size: {indentSize}px</Label>
							<input type="range" min="1.5" max="40" bind:value={indentSize} class="w-full mt-2" />
						</div>
						
						<div>
							<Label>Icon Size: {iconSize}px</Label>
							<input type="range" min="12" max="24" bind:value={iconSize} class="w-full mt-2" />
						</div>
						
						<div>
							<Label>Font Size: {fontSize}px</Label>
							<input type="range" min="10" max="20" bind:value={fontSize} class="w-full mt-2" />
						</div>
						
						<div>
							<Label>Item Padding: {itemPadding}px</Label>
							<input type="range" min="0" max="16" bind:value={itemPadding} class="w-full mt-2" />
						</div>
						
						<div>
							<Label>Item Gap: {itemGap}px</Label>
							<input type="range" min="0" max="16" bind:value={itemGap} class="w-full mt-2" />
						</div>
						
						<div>
							<Label>Border Radius: {borderRadius}px</Label>
							<input type="range" min="0" max="12" bind:value={borderRadius} class="w-full mt-2" />
						</div>
					</div>
					
					<div class="space-y-4">
						<h3 class="text-lg font-medium">Features</h3>
						
						<div class="space-y-2">
							<label class="flex items-center gap-2">
								<input type="checkbox" bind:checked={showIcons} class="rounded" />
								<span>Show Icons</span>
							</label>
							
							<label class="flex items-center gap-2">
								<input type="checkbox" bind:checked={showBadges} class="rounded" />
								<span>Show Badges</span>
							</label>
							
							<label class="flex items-center gap-2">
								<input type="checkbox" bind:checked={showDescriptions} class="rounded" />
								<span>Show Descriptions</span>
							</label>
							
							<label class="flex items-center gap-2">
								<input type="checkbox" bind:checked={showExtensions} class="rounded" />
								<span>Show Extensions</span>
							</label>
							
							<label class="flex items-center gap-2">
								<input type="checkbox" bind:checked={hoverEffect} class="rounded" />
								<span>Hover Effects</span>
							</label>
							
							<label class="flex items-center gap-2">
								<input type="checkbox" bind:checked={focusRing} class="rounded" />
								<span>Focus Ring</span>
							</label>
							
							<label class="flex items-center gap-2">
								<input type="checkbox" bind:checked={animateExpand} class="rounded" />
								<span>Animate Expand/Collapse</span>
							</label>
						</div>
						
						<Separator />
						
						<div>
							<Label>Expand Icon Type</Label>
							<div class="flex gap-2 mt-2">
								<Button 
									variant={expandIconType === 'chevron' ? 'default' : 'outline'} 
									size="sm"
									onclick={() => expandIconType = 'chevron'}
								>
									Chevron
								</Button>
								<Button 
									variant={expandIconType === 'plus' ? 'default' : 'outline'} 
									size="sm"
									onclick={() => expandIconType = 'plus'}
								>
									Plus
								</Button>
								<Button 
									variant={expandIconType === 'triangle' ? 'default' : 'outline'} 
									size="sm"
									onclick={() => expandIconType = 'triangle'}
								>
									Triangle
								</Button>
							</div>
						</div>
					</div>
				</div>
				
				<Separator />
				
				<div>
					<Label>Live Preview</Label>
					<div class="border rounded-lg p-4 mt-2">
						{#each sampleItems as item}
							<TreeViewGroup
								{item}
								expanded={expandedIds.has(item.id)}
								onToggle={() => handleExpand(item, !expandedIds.has(item.id))}
								{indentSize}
								class={cn(
									"mb-1 transition-all",
									animateExpand && "duration-200"
								)}
								style={`font-size: ${fontSize}px;`}
							>
								{#snippet icon(expanded)}
									{#if showIcons}
										{@const Icon = getIcon(item, expanded)}
										<Icon style={`width: ${iconSize}px; height: ${iconSize}px;`} class="text-muted-foreground" />
									{/if}
								{/snippet}

								{#snippet label()}
									<div class="flex items-center justify-between w-full">
										<span>{item.label}</span>
										{#if showBadges && item.children?.length}
											<Badge variant="secondary" class="text-xs">
												{item.children.length}
											</Badge>
										{/if}
									</div>
								{/snippet}

								{#snippet children()}
									{#if item.children}
										<div class="space-y-1 mt-1" style={`margin-left: ${indentSize}px;`}>
											{#each item.children as child}
												<TreeViewItem
													item={child}
													level={1}
													{indentSize}
													selected={selectedId === child.id}
													onclick={() => handleSelect(child, selectedId !== child.id)}
													variant={selectedId === child.id ? 'selected' : 'default'}
													disabled={child.disabled}
													class={cn(
														hoverEffect && "hover:bg-muted/50",
														focusRing && "focus-visible:ring-2 focus-visible:ring-offset-2"
													)}
													style={`padding: ${itemPadding}px; gap: ${itemGap}px; border-radius: ${borderRadius}px; font-size: ${fontSize}px;`}
												>
													{#snippet children()}
														<div class="flex items-center" style={`gap: ${itemGap}px;`}>
															{#if showIcons}
																{@const ChildIcon = getIcon(child)}
																<ChildIcon style={`width: ${iconSize}px; height: ${iconSize}px;`} class="text-muted-foreground" />
															{/if}
															<span>{child.label}</span>
															{#if showExtensions && child.data?.extension}
																<Badge variant="secondary" class="text-xs ml-2">
																	{child.data.extension}
																</Badge>
															{/if}
														</div>
													{/snippet}
												</TreeViewItem>
											{/each}
										</div>
									{/if}
								{/snippet}
							</TreeViewGroup>
						{/each}
					</div>
				</div>
			</div>
		</TabsContent>

		<TabsContent value="styles" class="space-y-4">
			<h2 class="text-2xl font-semibold">Styling Examples</h2>
			<div class="space-y-4">
				<div>
					<Label>Variant Styles</Label>
					<p class="text-sm text-muted-foreground mb-2">
						Different visual styles for tree items
					</p>
					<div class="border rounded-lg p-4">
						{#each sampleItems as item}
							<TreeViewGroup
								{item}
								expanded={expandedIds.has(item.id)}
								onToggle={() => handleExpand(item, !expandedIds.has(item.id))}
								class="mb-1"
							>
								{#snippet icon(expanded)}
									{@const Icon = getIcon(item, expanded)}
									<Icon class="h-4 w-4 text-muted-foreground" />
								{/snippet}

								{#snippet label()}
									<span class={item.id === '2' ? 'font-bold text-primary' : ''}>{item.label}</span>
								{/snippet}

								{#snippet children()}
									{#if item.children}
										<div class="ml-4 space-y-1 mt-1">
											{#each item.children as child}
												<TreeViewItem
													item={child}
													level={1}
													selected={selectedId === child.id}
													onclick={() => handleSelect(child, selectedId !== child.id)}
													variant={getItemVariant(child)}
													disabled={child.disabled}
												>
													{#snippet children()}
														{@const ChildIcon = getIcon(child)}
														<div class="flex items-center gap-2">
															<ChildIcon class="h-4 w-4 text-muted-foreground" />
															<span>{child.label}</span>
														</div>
													{/snippet}
												</TreeViewItem>
											{/each}
										</div>
									{/if}
								{/snippet}
							</TreeViewGroup>
						{/each}
					</div>
					<div class="mt-2 space-y-1 text-sm">
						<p>• Disabled items: Ghost variant (grayed out)</p>
						<p>• "Media" folder: Active variant (highlighted)</p>
						<p>• Selected item: Selected variant</p>
						<p>• Other items: Default variant</p>
					</div>
				</div>
			</div>
		</TabsContent>


		<TabsContent value="custom" class="space-y-4">
			<h2 class="text-2xl font-semibold">Custom Rendering</h2>
			<div class="space-y-4">
				<div>
					<Label>Custom Icons and Labels with Tooltips</Label>
					<div class="flex gap-4 mb-2">
						<Button variant="outline" size="sm" onclick={() => showDescriptions = !showDescriptions}>
							{showDescriptions ? 'Hide' : 'Show'} Descriptions
						</Button>
						<Button variant="outline" size="sm" onclick={() => showExtensions = !showExtensions}>
							{showExtensions ? 'Hide' : 'Show'} Extensions
						</Button>
					</div>
					<div class="border rounded-lg p-4">
						<TooltipProvider>
							{#each sampleItems as item}
								<TreeViewGroup
									{item}
									expanded={expandedIds.has(item.id)}
									onToggle={() => handleExpand(item, !expandedIds.has(item.id))}
									class="mb-1"
								>
									{#snippet icon(expanded)}
										{@const Icon = getIcon(item, expanded)}
										<Tooltip>
											<TooltipTrigger>
												<Icon class="h-4 w-4 text-muted-foreground" />
											</TooltipTrigger>
											<TooltipContent>
												<p>{item.data?.type || 'Unknown'}</p>
											</TooltipContent>
										</Tooltip>
									{/snippet}

									{#snippet label()}
										<div class="flex items-center justify-between w-full">
											<span>{item.label}</span>
											{#if showDescriptions && item.data?.description}
												<span class="text-xs text-muted-foreground ml-2">
													{item.data.description}
												</span>
											{/if}
										</div>
									{/snippet}

									{#snippet children()}
										{#if item.children}
											<div class="ml-4 space-y-1 mt-1">
												{#each item.children as child}
													<TreeViewItem
														item={child}
														level={1}
														selected={selectedId === child.id}
														onclick={() => handleSelect(child, selectedId !== child.id)}
														variant={selectedId === child.id ? 'selected' : 'default'}
														disabled={child.disabled}
													>
														{#snippet children()}
															{@const ChildIcon = getIcon(child)}
															<div class="flex items-center justify-between w-full gap-2">
																<div class="flex items-center gap-2 min-w-0">
																	<Tooltip>
																		<TooltipTrigger>
																			<ChildIcon class="h-4 w-4 text-muted-foreground shrink-0" />
																		</TooltipTrigger>
																		<TooltipContent>
																			<p>{child.data?.type || 'File'}</p>
																		</TooltipContent>
																	</Tooltip>
																	<span class="truncate">{child.label}</span>
																</div>
																<div class="flex items-center gap-2">
																	{#if showExtensions && child.data?.extension}
																		<Badge variant="secondary" class="text-xs">
																			{child.data.extension}
																		</Badge>
																	{/if}
																	{#if child.data?.description}
																		<Tooltip>
																			<TooltipTrigger>
																				<Info class="h-3 w-3 text-muted-foreground" />
																			</TooltipTrigger>
																			<TooltipContent>
																				<p>{child.data.description}</p>
																			</TooltipContent>
																		</Tooltip>
																	{/if}
																</div>
															</div>
														{/snippet}
													</TreeViewItem>
												{/each}
											</div>
										{/if}
									{/snippet}
								</TreeViewGroup>
							{/each}
						</TooltipProvider>
					</div>
				</div>

				<Separator />

				<div>
					<Label>Custom Styling Example</Label>
					<div class="border rounded-lg p-4 mt-2">
						<TooltipProvider>
							{#each sampleItems as item}
								<TreeViewGroup
									{item}
									expanded={expandedIds.has(item.id)}
									onToggle={() => handleExpand(item, !expandedIds.has(item.id))}
									indentSize={24}
									class="mb-1 transition-all hover:translate-x-1"
								>
									{#snippet icon(expanded)}
										{@const Icon = getIcon(item, expanded)}
										<Icon class="h-4 w-4 text-muted-foreground transition-transform duration-200" 
											style={expanded ? 'transform: rotate(90deg)' : ''} />
									{/snippet}

									{#snippet label()}
										<div class="flex items-center justify-between w-full">
											<span class="font-medium">{item.label}</span>
											{#if item.children?.length}
												<Badge variant="outline" class="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none">
													{item.children.length}
												</Badge>
											{/if}
										</div>
									{/snippet}

									{#snippet children()}
										{#if item.children}
											<div class="space-y-1 mt-1 border-l-2 border-dashed border-muted-foreground/20 pl-4" style="margin-left: 24px">
												{#each item.children as child}
													<TreeViewItem
														item={child}
														level={1}
														selected={multiSelectedIds.has(child.id)}
														onclick={() => handleMultiSelect(child, !multiSelectedIds.has(child.id))}
														variant={getItemVariant(child)}
														disabled={child.disabled}
														class="rounded-lg transition-all hover:shadow-lg hover:scale-105"
													>
														{#snippet children()}
															{@const ChildIcon = getIcon(child)}
															<div class="flex items-center justify-between w-full gap-2">
																<div class="flex items-center gap-2 min-w-0">
																	<div class="p-1 rounded bg-gradient-to-br from-primary/20 to-primary/10">
																		<ChildIcon class="h-4 w-4 text-primary" />
																	</div>
																	<span class="truncate">{child.label}</span>
																</div>
																<div class="flex items-center gap-1">
																	{#if child.data?.extension}
																		<Badge variant="secondary" class="text-xs bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700">
																			.{child.data.extension}
																		</Badge>
																	{/if}
																</div>
															</div>
														{/snippet}
													</TreeViewItem>
												{/each}
											</div>
										{/if}
									{/snippet}
								</TreeViewGroup>
							{/each}
						</TooltipProvider>
					</div>
				</div>
			</div>
		</TabsContent>
	</Tabs>
</div>