<script lang="ts">
  let count = 0;
  function increment() {
    count += 1;
  }
  $: doubled = count * 2;
  $: if (count >= 10) {
    alert('count is dangerously high!');
    count = 0;
  }
  let numbers = [1, 2, 3, 4];
  function addNumber() {
    // debugger;
    console.log("Add a number")
    numbers[numbers.length] = numbers.length + 1;
  }
  $: sum = numbers.reduce((total, currentNumber) => total + currentNumber, 0);
</script>

<main>
  <button on:click={increment}>
    Clicked {count} 
    {count === 1 ? 'time' : 'times'}
  </button>

 

  <p>{count} doubled is {doubled}</p>

  <button on:click={addNumber}>
    Add a number
  </button>
  <p>{numbers.join(' + ')} = {sum}</p>
  
</main>

<style>
  p {
		color: goldenrod;
		font-family: 'Comic Sans MS', cursive;
		font-size: 2em;
	}
</style>
