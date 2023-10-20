const config = {
  preprocess: preprocess(),
  kit: {
    adapter: adapter(),
    target: "#svelte",
    vite: {
      define: {
        global: {},
      },
    },
  },
};
