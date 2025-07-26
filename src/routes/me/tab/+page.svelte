<script>
  import { Tabs, TabsList, TabsTrigger, TabsContent } from "$lib/components/ui/tabs";
</script>

<div class="container mx-auto p-8">
  <h1 class="text-2xl font-bold mb-6">Tabs Example</h1>

  <Tabs value="tab1" class="w-full">
    <TabsList class="grid w-full grid-cols-3">
      <TabsTrigger value="tab1" class="data-[state=active]:bg-primary data-[state=active]:text-white">
        First Tab
      </TabsTrigger>
      <TabsTrigger value="tab2" class="data-[state=active]:bg-primary data-[state=active]:text-white">
        Second Tab
      </TabsTrigger>
      <TabsTrigger value="tab3" class="data-[state=active]:bg-primary data-[state=active]:text-white">
        Third Tab
      </TabsTrigger>
    </TabsList>

    <div class="mt-4 rounded-md border p-6">
      <TabsContent value="tab1">
        <h2 class="text-xl font-semibold mb-2">First Tab Content</h2>
        <p>This is the content for the first tab. You can put any content here.</p>
        <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Action Button 1
        </button>
      </TabsContent>

      <TabsContent value="tab2">
        <h2 class="text-xl font-semibold mb-2">Second Tab Content</h2>
        <p>Here's the content for the second tab with different information.</p>
        <div class="mt-4 flex gap-2">
          <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Accept
          </button>
          <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Reject
          </button>
        </div>
      </TabsContent>

      <TabsContent value="tab3">
        <h2 class="text-xl font-semibold mb-2">Third Tab Content</h2>
        <p>And finally, here's the content for the third tab.</p>
        <div class="mt-4">
          <input type="text" placeholder="Enter some text..."
                 class="px-4 py-2 border rounded w-full mb-2" />
          <button class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            Submit
          </button>
        </div>
      </TabsContent>
    </div>
  </Tabs>
</div>
