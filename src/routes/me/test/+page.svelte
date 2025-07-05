<script>
  // Dữ liệu được load từ +page.server.js
  export let data;
</script>

<h1>Danh sách người dùng</h1>
<ul>
  {#each data.users as user}
    <li>{user}</li>
  {/each}
</ul>

<h2>Thêm người dùng mới</h2>
<!-- Form sẽ tự động gọi action 'addUser' trong +page.server.js -->
<form method="POST" action="?/addUser">
  <input type="text" name="name" placeholder="Tên người dùng" required />
  <button type="submit">Thêm</button>
</form>