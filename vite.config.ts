import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    {
      name: 'error-handler',
      handleHotUpdate({ server }) {
        server.ws.on('error', (error) => {
          console.error('WebSocket error:', error);
          // Attempt to reconnect WebSocket
          setTimeout(() => {
            server.ws.connect();
          }, 1000);
        });
        return [];
      },
      configureServer(server) {
        // Global error handler for server
        server.middlewares.use((err, req, res, next) => {
          console.error('Server error:', err);
          next(err);
        });

        // Handle server shutdown gracefully
        const signals = ['SIGTERM', 'SIGINT', 'SIGHUP'];
        signals.forEach(signal => {
          process.on(signal, () => {
            console.log(`Received ${signal}, shutting down gracefully...`);
            server.close(() => {
              console.log('Server closed successfully');
              process.exit(0);
            });
          });
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    strictPort: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      timeout: 10000, // Increased timeout
      overlay: true,
      clientPort: 5173, // Explicitly set client port
      path: 'hmr', // Custom HMR path
      // Reconnection strategy
      reconnect: true,
      maxRetries: 5,
    },
    watch: {
      usePolling: true, // More reliable file watching
      interval: 1000,
      ignored: ['**/node_modules/**', '**/.git/**'], // Ignore unnecessary files
    },
    middlewareMode: false,
    cors: true,
    open: false,
    // Force shutdown on errors
    force: true,
    // Improved error handling
    error(err) {
      console.error('Vite server error:', err);
    },
  },
  build: {
    // Improved build configuration
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      },
    },
    sourcemap: true,
    // Improved chunk handling
    chunkSizeWarningLimit: 1000,
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
      extensions: ['.js', '.cjs'],
    },
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging
        drop_debugger: true,
      },
    },
  },
  // Improved error overlay
  clearScreen: false,
  logLevel: 'info',
});