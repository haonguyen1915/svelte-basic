// +page.server.js
let users = ['Alice', 'Bob', 'Charlie'];

export async function load() {
  // Trả danh sách người dùng cho +page.svelte
  return {
    users
  };
}

export const actions = {
  /**
   * @param {{ request: Request }} param0
   */
  addUser: async ({ request }) => {
    const formData = await request.formData();
    const newUser = formData.get('name');

    if (typeof newUser === 'string' && newUser) {
      users.push(newUser);
    }

    // Trả kết quả về cho +page.svelte
    return { success: true };
  }
};