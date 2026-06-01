import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // 用相对路径输出资源，便于嵌入个人主页的任意子路径 / 子域名而不 404。
  base: "./",
  plugins: [react()],
});

