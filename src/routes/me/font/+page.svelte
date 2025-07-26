<script>
  import { onMount } from 'svelte';

  // Font options to test
  const fontFamilies = [
    { name: 'System Default', value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
    { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Courier New', value: '"Courier New", Courier, monospace' },
    { name: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Open Sans', value: '"Open Sans", sans-serif' },
    { name: 'JetBrains Mono', value: '"JetBrains Mono", sans-serif' }
  ];

  const fontWeights = [
    { name: 'Thin (100)', value: 100 },
    { name: 'Extra Light (200)', value: 200 },
    { name: 'Light (300)', value: 300 },
    { name: 'Regular (400)', value: 400 },
    { name: 'Medium (500)', value: 500 },
    { name: 'Semi Bold (600)', value: 600 },
    { name: 'Bold (700)', value: 700 },
    { name: 'Extra Bold (800)', value: 800 },
    { name: 'Black (900)', value: 900 }
  ];

  const fontSizes = [
    { name: 'Extra Small (12px)', value: '12px' },
    { name: 'Small (14px)', value: '14px' },
    { name: 'Base (16px)', value: '16px' },
    { name: 'Medium (18px)', value: '18px' },
    { name: 'Large (20px)', value: '20px' },
    { name: 'Extra Large (24px)', value: '24px' },
    { name: 'Double Extra Large (30px)', value: '30px' },
    { name: 'Triple Extra Large (36px)', value: '36px' },
    { name: 'Huge (48px)', value: '48px' }
  ];

  // Default values
  let selectedFontFamily = fontFamilies[0].value;
  let selectedFontWeight = fontWeights[3].value; // Regular (400)
  let selectedFontSize = fontSizes[2].value; // Base (16px)
  let customText = "The quick brown fox jumps over the lazy dog";
  let letterSpacing = "0px";
  let lineHeight = "1.5";
  let fontStyle = "normal";
  let textTransform = "none";
  let isItalic = false;
  let isUppercase = false;

  // Sample texts to demonstrate font rendering
  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog",
    "Pack my box with five dozen liquor jugs",
    "How vexingly quick daft zebras jump!",
    "Sphinx of black quartz, judge my vow",
    "0123456789 !@#$%^&*()_+{}|:\"<>?",
  ];

  // Dynamic style based on user selections
  $: fontStyle = isItalic ? 'italic' : 'normal';
  $: textTransform = isUppercase ? 'uppercase' : 'none';

  // Function to load Google Fonts dynamically
  function loadGoogleFont(fontFamily) {
    // Only attempt to load Google Fonts, not system fonts
    const googleFonts = ['Roboto', 'Open Sans'];
    const fontName = fontFamily.split(',')[0].replace(/["']/g, '').trim();

    if (googleFonts.includes(fontName)) {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}:wght@${selectedFontWeight}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }

  onMount(() => {
    loadGoogleFont(selectedFontFamily);
  });

  $: {
    loadGoogleFont(selectedFontFamily);
  }
</script>

<svelte:head>
  <title>Font Tester</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Font Tester</h1>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Controls Panel -->
    <div class="col-span-1 bg-secondary/50 p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Font Controls</h2>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1" for="fontFamily">
          Font Family
        </label>
        <select
          id="fontFamily"
          class="w-full p-2 border rounded"
          bind:value={selectedFontFamily}
        >
          {#each fontFamilies as font}
            <option value={font.value}>{font.name}</option>
          {/each}
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1" for="fontWeight">
          Font Weight
        </label>
        <select
          id="fontWeight"
          class="w-full p-2 border rounded"
          bind:value={selectedFontWeight}
        >
          {#each fontWeights as weight}
            <option value={weight.value}>{weight.name}</option>
          {/each}
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1" for="fontSize">
          Font Size
        </label>
        <select
          id="fontSize"
          class="w-full p-2 border rounded"
          bind:value={selectedFontSize}
        >
          {#each fontSizes as size}
            <option value={size.value}>{size.name}</option>
          {/each}
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1" for="letterSpacing">
          Letter Spacing
        </label>
        <input
          id="letterSpacing"
          type="text"
          class="w-full p-2 border rounded"
          bind:value={letterSpacing}
          placeholder="e.g., 1px, 0.1em"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1" for="lineHeight">
          Line Height
        </label>
        <input
          id="lineHeight"
          type="text"
          class="w-full p-2 border rounded"
          bind:value={lineHeight}
          placeholder="e.g., 1.5, 24px"
        />
      </div>

      <div class="mb-4">
        <div class="flex items-center">
          <input
            id="italic"
            type="checkbox"
            class="mr-2"
            bind:checked={isItalic}
          />
          <label for="italic">Italic</label>
        </div>
      </div>

      <div class="mb-4">
        <div class="flex items-center">
          <input
            id="uppercase"
            type="checkbox"
            class="mr-2"
            bind:checked={isUppercase}
          />
          <label for="uppercase">Uppercase</label>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1" for="customText">
          Custom Text
        </label>
        <textarea
          id="customText"
          class="w-full p-2 border rounded"
          bind:value={customText}
          rows="3"
        ></textarea>
      </div>

      <!-- CSS Output -->
      <div class="mt-6 p-3 bg-gray-100 rounded">
        <h3 class="text-sm font-semibold mb-2">CSS Output:</h3>
        <pre class="text-xs overflow-x-auto">font-family: {selectedFontFamily};
font-weight: {selectedFontWeight};
font-size: {selectedFontSize};
letter-spacing: {letterSpacing};
line-height: {lineHeight};
font-style: {fontStyle};
text-transform: {textTransform};</pre>
      </div>
    </div>

    <!-- Preview Panel -->
    <div class="col-span-1 lg:col-span-2 bg-secondary p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Font Preview</h2>

      <!-- Custom Text Preview -->
      <div class="mb-6 p-4 border rounded">
        <h3 class="text-sm font-semibold mb-2">Custom Text:</h3>
        <p style="
          font-family: {selectedFontFamily};
          font-weight: {selectedFontWeight};
          font-size: {selectedFontSize};
          letter-spacing: {letterSpacing};
          line-height: {lineHeight};
          font-style: {fontStyle};
          text-transform: {textTransform};
        ">{customText}</p>
      </div>

      <!-- Sample Text Preview -->
      <div class="mb-6">
        <h3 class="text-sm font-semibold mb-2">Sample Texts:</h3>
        {#each sampleTexts as text}
          <div class="p-3 border-b">
            <p style="
              font-family: {selectedFontFamily};
              font-weight: {selectedFontWeight};
              font-size: {selectedFontSize};
              letter-spacing: {letterSpacing};
              line-height: {lineHeight};
              font-style: {fontStyle};
              text-transform: {textTransform};
            ">{text}</p>
          </div>
        {/each}
      </div>

      <!-- Font Size Showcase -->
      <div class="mb-6">
        <h3 class="text-sm font-semibold mb-2">Size Scale:</h3>
        <div class="space-y-3">
          {#each fontSizes as size}
            <p style="
              font-family: {selectedFontFamily};
              font-weight: {selectedFontWeight};
              font-size: {size.value};
              letter-spacing: {letterSpacing};
              line-height: {lineHeight};
              font-style: {fontStyle};
              text-transform: {textTransform};
            ">{size.name}: The quick brown fox</p>
          {/each}
        </div>
      </div>

      <!-- Font Weight Showcase -->
      <div>
        <h3 class="text-sm font-semibold mb-2">Weight Scale:</h3>
        <div class="space-y-3">
          {#each fontWeights as weight}
            <p style="
              font-family: {selectedFontFamily};
              font-weight: {weight.value};
              font-size: {selectedFontSize};
              letter-spacing: {letterSpacing};
              line-height: {lineHeight};
              font-style: {fontStyle};
              text-transform: {textTransform};
            ">{weight.name}: The quick brown fox</p>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Add any custom styles here */
  pre {
    white-space: pre-wrap;
  }
</style>
